import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
import { useInviteMember } from '@/hooks/useInviteMember';

// Validation schema
const inviteSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
});

type InviteForm = z.infer<typeof inviteSchema>;

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

const roleOptions = [
  { value: 'ADMIN' as const, label: 'Quản trị', description: 'Quản lý thành viên và cài đặt' },
  { value: 'MEMBER' as const, label: 'Thành viên', description: 'Tạo và chỉnh sửa tasks' },
  { value: 'VIEWER' as const, label: 'Xem', description: 'Chỉ xem, không chỉnh sửa' },
];

export default function InviteMemberModal({ isOpen, onClose, workspaceId }: InviteMemberModalProps) {
  const inviteMember = useInviteMember();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'MEMBER',
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // Submit handler
  const onSubmit = (data: InviteForm) => {
    inviteMember.mutate(
      {
        workspaceId,
        data: {
          email: data.email,
          role: data.role,
        },
      },
      {
        onSuccess: () => {
          onClose();
          reset();
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Mời thành viên</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="invite-email" className="label">
              Email
            </label>
            <input
              id="invite-email"
              type="email"
              {...register('email')}
              className="input"
              placeholder="member@example.com"
              autoFocus
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="invite-role" className="label">
              Vai trò
            </label>
            <select
              id="invite-role"
              {...register('role')}
              className="input"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} — {option.description}
                </option>
              ))}
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={inviteMember.isPending}
              className="btn-primary"
            >
              {inviteMember.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi lời mời'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
