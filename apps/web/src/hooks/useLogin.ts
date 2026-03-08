import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';

interface LoginDto {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    provider: 'LOCAL' | 'GOOGLE';
    theme: 'LIGHT' | 'DARK' | 'SYSTEM';
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export function useLogin(redirectTo?: string) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginDto) => {
      const response = await api.post<AuthResponse>('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success('Đăng nhập thành công!');
      navigate(redirectTo || '/', { replace: true });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Đăng nhập thất bại';
      toast.error(message);
    },
  });
}
