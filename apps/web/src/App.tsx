import { Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from '@/stores/theme.store';
import { useEffect } from 'react';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Route guards
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';

// Auth pages
import LoginPage from '@/features/auth/LoginPage';
import RegisterPage from '@/features/auth/RegisterPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';
import ProfilePage from '@/features/auth/pages/ProfilePage';
import ChangePasswordPage from '@/features/auth/pages/ChangePasswordPage';
import GoogleCallbackPage from '@/features/auth/pages/GoogleCallbackPage';
import VerifyEmailPage from '@/features/auth/pages/VerifyEmailPage';

// Main pages (placeholders)
import DashboardPage from '@/features/dashboard/DashboardPage';
import ProjectsPage from '@/features/projects/ProjectsPage';
import KanbanPage from '@/features/kanban/KanbanPage';

// Workspace pages
import WorkspaceListPage from '@/features/workspaces/WorkspaceListPage';
import WorkspaceSettingsPage from '@/features/workspaces/WorkspaceSettingsPage';
import MembersPage from '@/features/workspaces/MembersPage';
import JoinInvitationPage from '@/features/workspaces/JoinInvitationPage';

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  return (
    <Routes>
      {/* Public routes — redirect to / if already logged in */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        {/* Email-related routes */}
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      </Route>

      {/* Join invitation — standalone, accessible regardless of auth state */}
      <Route path="/invite/:token" element={<JoinInvitationPage />} />

      {/* Protected routes — redirect to /login if not authenticated */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId/kanban" element={<KanbanPage />} />
        <Route path="/settings/profile" element={<ProfilePage />} />
        <Route path="/settings/password" element={<ChangePasswordPage />} />

        {/* Workspace routes */}
        <Route path="/workspaces" element={<WorkspaceListPage />} />
        <Route path="/workspaces/:id/settings" element={<WorkspaceSettingsPage />} />
        <Route path="/workspaces/:id/members" element={<MembersPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
