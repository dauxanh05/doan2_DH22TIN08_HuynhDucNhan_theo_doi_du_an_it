import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useVerifyEmail } from '@/hooks/useVerifyEmail';

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const hasCalled = useRef(false);
  const mutation = useVerifyEmail();

  useEffect(() => {
    if (token && !hasCalled.current) {
      hasCalled.current = true;
      mutation.mutate(token);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!token) {
    return (
      <div className="text-center py-8">
        <XCircle className="w-12 h-12 mx-auto text-red-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Link xác thực không hợp lệ
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Vui lòng kiểm tra lại link trong email.
        </p>
        <Link to="/login" className="btn-primary inline-block mt-6">
          Quay lại đăng nhập
        </Link>
      </div>
    );
  }

  if (mutation.isPending || mutation.isIdle) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-12 h-12 mx-auto text-indigo-600 dark:text-indigo-400 animate-spin" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Đang xác thực email...</p>
      </div>
    );
  }

  if (mutation.isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Email đã được xác thực thành công!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Bạn có thể đăng nhập ngay bây giờ.</p>
        <Link to="/login" className="btn-primary inline-block mt-6">
          Đăng nhập
        </Link>
      </div>
    );
  }

  const errorMessage =
    (mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    'Xác thực email thất bại. Vui lòng thử lại.';

  return (
    <div className="text-center py-8">
      <XCircle className="w-12 h-12 mx-auto text-red-500" />
      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        Xác thực email thất bại
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{errorMessage}</p>
      <Link to="/login" className="btn-primary inline-block mt-6">
        Quay lại đăng nhập
      </Link>
    </div>
  );
}
