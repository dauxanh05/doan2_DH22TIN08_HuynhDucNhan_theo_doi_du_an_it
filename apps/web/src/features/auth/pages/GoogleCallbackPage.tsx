import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const hasCalled = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code || hasCalled.current) return;
    hasCalled.current = true;

    api.post('/auth/google/exchange', { code })
      .then((res) => {
        const { accessToken, user } = res.data;
        if (!accessToken || !user) {
          throw new Error('Invalid exchange response');
        }
        setAuth(user, accessToken);
        toast.success('Dang nhap Google thanh cong!');
        navigate('/', { replace: true });
      })
      .catch(() => {
        toast.error('Dang nhap Google that bai');
        navigate('/login', { replace: true });
      });
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-600">Dang xu ly dang nhap Google...</p>
      </div>
    </div>
  );
}
