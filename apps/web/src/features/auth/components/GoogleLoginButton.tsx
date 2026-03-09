/**
 * GoogleLoginButton — redirects to backend Google OAuth endpoint.
 * Uses VITE_API_URL env variable for backend origin.
 */
export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <button type="button" className="mt-4 w-full btn-secondary" onClick={handleGoogleLogin}>
      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
      Đăng nhập với Google
    </button>
  );
}
