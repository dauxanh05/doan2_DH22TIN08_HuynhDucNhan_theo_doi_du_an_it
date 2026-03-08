import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export function useRegister(redirectTo?: string) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterDto) => {
      const response = await api.post('/auth/register', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực.');
      navigate('/login', {
        replace: true,
        state: redirectTo ? { from: redirectTo } : { fromRegister: true },
      });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Đăng ký thất bại';
      toast.error(message);
    },
  });
}
