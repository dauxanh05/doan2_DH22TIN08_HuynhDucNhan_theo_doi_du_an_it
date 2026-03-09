import { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useSendOtp } from '@/hooks/useRegister';
import { useVerifyOtp } from '@/hooks/useVerifyOtp';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [formData, setFormData] = useState<{ name: string; email: string; password: string } | null>(null);
  const [otpValues, setOtpValues] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();

  const redirectTo = location.state?.from as string | undefined;
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp(redirectTo);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const onSubmit = (data: RegisterForm) => {
    const payload = { name: data.name, email: data.email, password: data.password };
    setFormData(payload);
    sendOtpMutation.mutate(payload, {
      onSuccess: () => {
        setStep('otp');
        setCountdown(RESEND_COOLDOWN);
        // Focus first OTP input after step change
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      },
    });
  };

  const handleResendOtp = () => {
    if (!formData || countdown > 0) return;
    sendOtpMutation.mutate(formData, {
      onSuccess: () => {
        setCountdown(RESEND_COOLDOWN);
        setOtpValues(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      },
    });
  };

  const submitOtp = useCallback(
    (values: string[]) => {
      const otp = values.join('');
      if (otp.length !== OTP_LENGTH || !formData) return;
      verifyOtpMutation.mutate({ email: formData.email, otp });
    },
    [formData, verifyOtpMutation],
  );

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newValues = [...otpValues];
    newValues[index] = digit;
    setOtpValues(newValues);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all 6 digits filled
    if (digit && newValues.every((v) => v !== '')) {
      submitOtp(newValues);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newValues = [...otpValues];
    for (let i = 0; i < pasted.length; i++) {
      newValues[i] = pasted[i];
    }
    setOtpValues(newValues);

    // Focus last filled or next empty
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();

    // Auto submit if all filled
    if (newValues.every((v) => v !== '')) {
      submitOtp(newValues);
    }
  };

  // Step 2: OTP form
  if (step === 'otp') {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setStep('register');
            setOtpValues(Array(OTP_LENGTH).fill(''));
          }}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nhập mã OTP</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Mã xác thực đã được gửi đến <strong>{formData?.email}</strong>
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {otpValues.map((value, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              onPaste={index === 0 ? handleOtpPaste : undefined}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-800 dark:text-white outline-none transition-colors"
              disabled={verifyOtpMutation.isPending}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => submitOtp(otpValues)}
          disabled={verifyOtpMutation.isPending || otpValues.some((v) => !v)}
          className="btn-primary w-full"
        >
          {verifyOtpMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang xác thực...
            </>
          ) : (
            'Xác nhận'
          )}
        </button>

        <div className="mt-4 text-center">
          {countdown > 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gửi lại mã sau <span className="font-medium text-indigo-600">{countdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={sendOtpMutation.isPending}
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {sendOtpMutation.isPending ? 'Đang gửi...' : 'Gửi lại mã'}
            </button>
          )}
        </div>

        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
          Mã OTP sẽ hết hạn sau 5 phút
        </p>
      </div>
    );
  }

  // Step 1: Register form
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Đăng ký tài khoản</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="label">
            Họ tên
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="input"
            placeholder="Nguyễn Văn A"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="input"
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="label">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="input pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label">
            Xác nhận mật khẩu
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="input"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" disabled={sendOtpMutation.isPending} className="btn-primary w-full">
          {sendOtpMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang gửi mã OTP...
            </>
          ) : (
            'Đăng ký'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
