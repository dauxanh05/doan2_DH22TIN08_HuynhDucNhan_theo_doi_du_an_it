import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';

interface VerifyOtpResponse {
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

export function useVerifyOtp(redirectTo?: string) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await api.post<VerifyOtpResponse>('/auth/verify-otp', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success('Xac thuc thanh cong! Chao mung ban.');
      navigate(redirectTo || '/', { replace: true });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Xac thuc OTP that bai';
      toast.error(message);
    },
  });
}
