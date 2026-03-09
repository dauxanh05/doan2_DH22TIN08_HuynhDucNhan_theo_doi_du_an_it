import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface SendOtpDto {
  name: string;
  email: string;
  password: string;
}

export function useSendOtp() {
  return useMutation({
    mutationFn: async (data: SendOtpDto) => {
      const response = await api.post('/auth/send-otp', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Ma OTP da duoc gui den email cua ban!');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gui OTP that bai';
      toast.error(message);
    },
  });
}
