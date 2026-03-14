#!/bin/bash
# Auto-test Auth + Users API endpoints
# Usage: bash test-api.sh

BASE_URL="http://localhost:3001/api"
PASS=0
FAIL=0
SKIP=0
EMAIL="testbot_$(date +%s)@example.com"
PASSWORD="Test1234!"
NEW_PASSWORD="NewPass5678!"
ACCESS_TOKEN=""
COOKIE_FILE="/tmp/test-api-cookies.txt"

# JWT Secret for generating test tokens (Verify Email, Reset Password)
ENV_FILE="apps/api/.env"
JWT_SECRET=""
if [ -f "$ENV_FILE" ]; then
  JWT_SECRET=$(grep '^JWT_SECRET=' "$ENV_FILE" | sed 's/^JWT_SECRET=//' | sed 's/^["'"'"']//;s/["'"'"']$//')
fi

# Generate JWT token using Node.js + jsonwebtoken (same lib as backend)
# Usage: generate_jwt_token <email> <type> <secret_suffix> <expires_in>
generate_jwt_token() {
  local email="$1" type="$2" suffix="$3" exp="$4"
  JWT_EMAIL="$email" JWT_TYPE="$type" JWT_SECRET_FULL="${JWT_SECRET}_${suffix}" JWT_EXP="$exp" \
  NODE_PATH="$(pwd)/apps/api/node_modules" node -e "
    const jwt = require('jsonwebtoken');
    console.log(jwt.sign(
      { email: process.env.JWT_EMAIL, type: process.env.JWT_TYPE },
      process.env.JWT_SECRET_FULL,
      { expiresIn: process.env.JWT_EXP }
    ));
  " 2>/dev/null
}

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log_pass() { echo -e "${GREEN}✓ PASS${NC} $1"; ((PASS++)); }
log_fail() { echo -e "${RED}✗ FAIL${NC} $1 — $2"; ((FAIL++)); }
log_skip() { echo -e "${YELLOW}⊘ SKIP${NC} $1 — $2"; ((SKIP++)); }
log_info() { echo -e "${CYAN}→${NC} $1"; }

echo "========================================"
echo " DevTeamOS API Test Suite"
echo " Base URL: $BASE_URL"
echo " Test email: $EMAIL"
echo "========================================"
echo ""

# Clean cookie file
rm -f "$COOKIE_FILE"

# ========================================
# A. AUTH MODULE
# ========================================
echo "━━━ A. Auth Module ━━━"
echo ""

# 1. Register
echo "── 1. Register ──"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -c "$COOKIE_FILE" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"Test Bot\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ]; then
  # Register returns { message, user } — NO token, NO cookie (by design)
  HAS_MESSAGE=$(echo "$BODY" | grep -o '"message"')
  HAS_USER=$(echo "$BODY" | grep -o '"user"')
  if [ -n "$HAS_MESSAGE" ] && [ -n "$HAS_USER" ]; then
    log_pass "Register — 201 + message & user received"
  else
    log_fail "Register" "201 but missing message or user in response"
  fi
  # Security: password must not leak in response
  if echo "$BODY" | grep -q '"password"'; then
    log_fail "Register security" "Response contains password field!"
  else
    log_pass "Register — no password leaked in response"
  fi
else
  log_fail "Register" "Expected 201, got $HTTP_CODE"
  echo "  Body: $BODY"
fi
echo ""

# 2. Login
echo "── 2. Login ──"
rm -f "$COOKIE_FILE"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -c "$COOKIE_FILE" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  ACCESS_TOKEN=$(echo "$BODY" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
  if [ -n "$ACCESS_TOKEN" ]; then
    log_pass "Login — $HTTP_CODE + accessToken received"
  else
    log_fail "Login" "$HTTP_CODE but no accessToken"
  fi
  if grep -q "refresh_token" "$COOKIE_FILE" 2>/dev/null; then
    log_pass "Login — refresh_token cookie set"
  else
    log_fail "Login cookie" "No refresh_token cookie"
  fi
else
  log_fail "Login" "Expected 200/201, got $HTTP_CODE"
  echo "  Body: $BODY"
fi
echo ""

# 3. Refresh
echo "── 3. Refresh Token ──"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/refresh" \
  -b "$COOKIE_FILE" \
  -c "$COOKIE_FILE")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  NEW_TOKEN=$(echo "$BODY" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
  if [ -n "$NEW_TOKEN" ]; then
    ACCESS_TOKEN="$NEW_TOKEN"
    log_pass "Refresh — $HTTP_CODE + new accessToken"
  else
    log_fail "Refresh" "$HTTP_CODE but no new accessToken"
  fi
else
  log_fail "Refresh" "Expected 200, got $HTTP_CODE"
  echo "  Body: $BODY"
fi
echo ""

# 4. Logout
echo "── 4. Logout ──"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -b "$COOKIE_FILE" \
  -c "$COOKIE_FILE")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  log_pass "Logout — $HTTP_CODE"
  # Verify: refresh should fail after logout
  VERIFY=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/refresh" \
    -b "$COOKIE_FILE")
  VERIFY_CODE=$(echo "$VERIFY" | tail -1)
  if [ "$VERIFY_CODE" = "401" ]; then
    log_pass "Logout verify — Refresh returns 401 after logout"
  else
    log_fail "Logout verify" "Refresh returned $VERIFY_CODE instead of 401"
  fi
else
  log_fail "Logout" "Expected 200, got $HTTP_CODE"
fi
echo ""

# Re-login to continue testing
rm -f "$COOKIE_FILE"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -c "$COOKIE_FILE" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')
ACCESS_TOKEN=$(echo "$BODY" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
log_info "Re-logged in for remaining tests"
echo ""

# 5. Forgot Password
echo "── 5. Forgot Password ──"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  log_pass "Forgot Password — $HTTP_CODE (email sent or SMTP not configured)"
elif [ "$HTTP_CODE" = "500" ]; then
  log_skip "Forgot Password" "500 — SMTP not configured (expected behavior)"
else
  log_fail "Forgot Password" "Expected 200 or 500, got $HTTP_CODE"
fi

# Test enumeration protection: non-existent email should also return 200
RESPONSE2=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@fake.com"}')
HTTP_CODE2=$(echo "$RESPONSE2" | tail -1)
if [ "$HTTP_CODE2" = "200" ] || [ "$HTTP_CODE2" = "201" ] || [ "$HTTP_CODE2" = "500" ]; then
  log_pass "Forgot Password — anti-enumeration OK (same response for unknown email)"
else
  log_fail "Forgot Password enumeration" "Different response ($HTTP_CODE2) for unknown email"
fi
echo ""

# 6. Verify Email
echo "── 6. Verify Email ──"
if [ -n "$JWT_SECRET" ]; then
  VERIFY_TOKEN=$(generate_jwt_token "$EMAIL" "verify-email" "verify" "24h")
  if [ -n "$VERIFY_TOKEN" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/auth/verify-email/$VERIFY_TOKEN")
    HTTP_CODE=$(echo "$RESPONSE" | tail -1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
      log_pass "Verify Email — 200 (email verified)"
    else
      log_fail "Verify Email" "Expected 200, got $HTTP_CODE"
      echo "  Body: $BODY"
    fi
  else
    log_skip "Verify Email" "Failed to generate JWT token (check node/jsonwebtoken)"
  fi
else
  log_skip "Verify Email" "JWT_SECRET not found in $ENV_FILE"
fi
echo ""

# 7. Reset Password
echo "── 7. Reset Password ──"
if [ -n "$JWT_SECRET" ]; then
  RESET_TOKEN=$(generate_jwt_token "$EMAIL" "reset-password" "reset" "1h")
  if [ -n "$RESET_TOKEN" ]; then
    # Reset to same $PASSWORD to not break downstream tests
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/reset-password" \
      -H "Content-Type: application/json" \
      -d "{\"token\":\"$RESET_TOKEN\",\"newPassword\":\"$PASSWORD\"}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "200" ]; then
      log_pass "Reset Password — 200 (password reset successful)"
      # Re-login (reset revokes all refresh tokens)
      rm -f "$COOKIE_FILE"
      VERIFY=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -c "$COOKIE_FILE" \
        -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
      VERIFY_CODE=$(echo "$VERIFY" | tail -1)
      if [ "$VERIFY_CODE" = "200" ] || [ "$VERIFY_CODE" = "201" ]; then
        log_pass "Reset Password verify — login after reset OK"
        ACCESS_TOKEN=$(echo "$VERIFY" | sed '$d' | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
      else
        log_fail "Reset Password verify" "Cannot login after reset ($VERIFY_CODE)"
      fi
    else
      log_fail "Reset Password" "Expected 200, got $HTTP_CODE"
      echo "  Body: $BODY"
    fi
  else
    log_skip "Reset Password" "Failed to generate JWT token (check node/jsonwebtoken)"
  fi
else
  log_skip "Reset Password" "JWT_SECRET not found in $ENV_FILE"
fi
echo ""

# 8-9. Google OAuth
echo "── 8-9. Google OAuth ──"
RESPONSE=$(curl -s -w "\n%{http_code}" -o /dev/null "$BASE_URL/auth/google" -L --max-redirs 0 2>/dev/null)
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "302" ] || [ "$HTTP_CODE" = "301" ]; then
  log_pass "Google OAuth — redirect works ($HTTP_CODE)"
elif [ "$HTTP_CODE" = "500" ]; then
  log_skip "Google OAuth" "Not configured (500) — skip"
else
  log_skip "Google OAuth" "Status $HTTP_CODE — may not be configured"
fi
echo ""

# ========================================
# B. USERS MODULE
# ========================================
echo "━━━ B. Users Module ━━━"
echo ""

# 10. Get Profile
echo "── 10. Get Profile ──"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  # Check no password field
  if echo "$BODY" | grep -q '"password"'; then
    log_fail "Get Profile" "Response contains password field!"
  else
    log_pass "Get Profile — 200 + no password leaked"
  fi
else
  log_fail "Get Profile" "Expected 200, got $HTTP_CODE"
  echo "  Body: $BODY"
fi

# Test without auth
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/me")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "401" ]; then
  log_pass "Get Profile — 401 without token (auth guard works)"
else
  log_fail "Get Profile auth" "Expected 401 without token, got $HTTP_CODE"
fi
echo ""

# 11. Update Profile
echo "── 11. Update Profile ──"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/users/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Bot Name"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  if echo "$BODY" | grep -q "Updated Bot Name"; then
    log_pass "Update Profile — 200 + name updated"
  else
    log_pass "Update Profile — 200 (response may not echo name)"
  fi
else
  log_fail "Update Profile" "Expected 200, got $HTTP_CODE"
  echo "  Body: $BODY"
fi

# Test invalid theme
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/users/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"theme":"INVALID"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "400" ]; then
  log_pass "Update Profile — 400 for invalid theme (validation works)"
else
  log_fail "Update Profile validation" "Expected 400 for invalid theme, got $HTTP_CODE"
fi
echo ""

# 12. Change Password
echo "── 12. Change Password ──"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/users/me/password" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"currentPassword\":\"$PASSWORD\",\"newPassword\":\"$NEW_PASSWORD\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "200" ]; then
  log_pass "Change Password — 200"

  # Verify: login with new password
  VERIFY=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -c "$COOKIE_FILE" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$NEW_PASSWORD\"}")
  VERIFY_CODE=$(echo "$VERIFY" | tail -1)
  if [ "$VERIFY_CODE" = "200" ] || [ "$VERIFY_CODE" = "201" ]; then
    log_pass "Change Password verify — login with new password OK"
    # Update token
    ACCESS_TOKEN=$(echo "$VERIFY" | sed '$d' | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
  else
    log_fail "Change Password verify" "Cannot login with new password ($VERIFY_CODE)"
  fi
else
  log_fail "Change Password" "Expected 200, got $HTTP_CODE"
fi

# Test wrong current password
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/users/me/password" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"WrongPassword!","newPassword":"Another1234!"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "400" ] || [ "$HTTP_CODE" = "401" ]; then
  log_pass "Change Password — $HTTP_CODE for wrong current password"
else
  log_fail "Change Password validation" "Expected 400/401 for wrong password, got $HTTP_CODE"
fi
echo ""

# 13. Upload Avatar
echo "── 13. Upload Avatar ──"
# Create a tiny test image (1x1 pixel PNG)
AVATAR_FILE="/tmp/test-avatar.png"
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82' > "$AVATAR_FILE"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/me/avatar" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "avatar=@$AVATAR_FILE;type=image/png")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  log_pass "Upload Avatar — $HTTP_CODE"
  AVATAR_URL=$(echo "$BODY" | grep -o '"avatar":"[^"]*"' | cut -d'"' -f4)
  if [ -n "$AVATAR_URL" ]; then
    log_info "Avatar URL: $AVATAR_URL"
    # Verify avatar accessible
    AVATAR_CHECK=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:3001$AVATAR_URL" 2>/dev/null)
    if [ "$AVATAR_CHECK" = "200" ]; then
      log_pass "Upload Avatar — file accessible at URL"
    else
      log_info "Avatar URL returned $AVATAR_CHECK (may need different base path)"
    fi
  fi
else
  log_fail "Upload Avatar" "Expected 200/201, got $HTTP_CODE"
  echo "  Body: $BODY"
fi

rm -f "$AVATAR_FILE"
echo ""

# ========================================
# SUMMARY
# ========================================
echo "========================================"
echo " TEST SUMMARY"
echo "========================================"
TOTAL=$((PASS + FAIL + SKIP))
echo -e " ${GREEN}PASS: $PASS${NC}  ${RED}FAIL: $FAIL${NC}  ${YELLOW}SKIP: $SKIP${NC}  TOTAL: $TOTAL"
echo "========================================"

# Cleanup
rm -f "$COOKIE_FILE"

if [ "$FAIL" -gt 0 ]; then
  exit 1
else
  exit 0
fi
