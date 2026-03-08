import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, Mail, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useJoinWorkspace } from '@/hooks/useJoinWorkspace';

export default function JoinInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const joinWorkspace = useJoinWorkspace();

  // Auto join when authenticated
  useEffect(() => {
    if (isHydrated && isAuthenticated && token && !joinWorkspace.isPending && !joinWorkspace.isSuccess && !joinWorkspace.isError) {
      joinWorkspace.mutate(token);
    }
  }, [isHydrated, isAuthenticated, token]);

  // Store not hydrated yet — show loading
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Authenticated — joining in progress
  if (isAuthenticated) {
    // Loading state
    if (joinWorkspace.isPending) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="card p-8 max-w-md w-full text-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Đang tham gia workspace...
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Vui lòng đợi trong giây lát.
            </p>
          </div>
        </div>
      );
    }

    // Error state
    if (joinWorkspace.isError) {
      const errorMessage =
        (joinWorkspace.error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Lời mời không hợp lệ hoặc đã hết hạn';

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="card p-8 max-w-md w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Không thể tham gia
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{errorMessage}</p>
            <Link
              to="/"
              className="btn-primary inline-flex"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      );
    }

    // Success state — hook already navigates to '/', but show fallback
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Not authenticated — show login/register options
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="card p-8 max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Bạn được mời tham gia workspace
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Bạn cần đăng nhập để tham gia workspace này.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/login', { state: { from: `/invite/${token}` } })}
            className="btn-primary w-full"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => navigate('/register', { state: { from: `/invite/${token}` } })}
            className="w-full px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
          >
            Đăng ký tài khoản mới
          </button>
        </div>
      </div>
    </div>
  );
}
