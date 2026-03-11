import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Trash2 } from 'lucide-react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useUpdateWorkspace } from '@/hooks/useUpdateWorkspace';
import { useDeleteWorkspace } from '@/hooks/useDeleteWorkspace';
import { useAuthStore } from '@/stores/auth.store';
import { useWorkspaceStore } from '@/stores/workspace.store';
import LogoPicker from '@/components/LogoPicker';

// Zod validation schema for workspace settings (logo managed separately via upload)
const settingsSchema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự').max(50, 'Tên tối đa 50 ký tự'),
  slug: z
    .string()
    .min(2, 'Slug tối thiểu 2 ký tự')
    .max(50, 'Slug tối đa 50 ký tự')
    .regex(/^[a-z0-9-]+$/, 'Chỉ cho phép chữ thường, số và dấu gạch ngang'),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function WorkspaceSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: workspace, isLoading } = useWorkspace(id);
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();
  const user = useAuthStore((s) => s.user);
  const setCurrentWorkspace = useWorkspaceStore((s) => s.setCurrentWorkspace);
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);

  // Sync currentWorkspace when viewing settings of a workspace
  useEffect(() => {
    if (!workspace) return;

    const nextWorkspace = {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      logo: workspace.logo,
      plan: workspace.plan,
      role: workspace.members.find((m) => m.userId === user?.id)?.role || 'MEMBER',
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };

    if (!currentWorkspace || currentWorkspace.id !== workspace.id) {
      setCurrentWorkspace(nextWorkspace);
      return;
    }

    const needsSync =
      currentWorkspace.name !== workspace.name ||
      currentWorkspace.slug !== workspace.slug ||
      currentWorkspace.logo !== workspace.logo ||
      currentWorkspace.plan !== workspace.plan ||
      currentWorkspace.updatedAt !== workspace.updatedAt;

    if (needsSync) {
      setCurrentWorkspace({
        ...currentWorkspace,
        ...nextWorkspace,
        role: currentWorkspace.role || nextWorkspace.role,
      });
    }
  }, [workspace, currentWorkspace, setCurrentWorkspace, user?.id]);

  // Derive role from workspace members data (not global store)
  const myMembership = workspace?.members.find((m) => m.userId === user?.id);
  const isOwner = myMembership?.role === 'OWNER';

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  });

  // Populate form when workspace data loads
  useEffect(() => {
    if (workspace) {
      reset({
        name: workspace.name,
        slug: workspace.slug,
      });
    }
  }, [workspace, reset]);

  // Submit settings form
  const onSubmit = (data: SettingsForm) => {
    if (!id) return;
    updateWorkspace.mutate({
      workspaceId: id,
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
  };

  // Handle workspace deletion
  const handleDelete = () => {
    if (!id) return;
    deleteWorkspace.mutate(id, {
      onSuccess: () => {
        navigate('/workspaces');
      },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Redirect invalid or stale workspace routes back to list
  if (!workspace || !currentWorkspace || currentWorkspace.id !== workspace.id) {
    return <Navigate to="/workspaces" replace />;
  }

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/workspaces" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Workspaces
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{workspace.name}</span>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">Cài đặt</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cài đặt workspace</h1>

      {/* Logo section */}
      <div className="card p-6 mb-6">
        <LogoPicker
          workspaceId={workspace.id}
          currentLogo={workspace.logo}
          workspaceName={workspace.name}
        />
      </div>

      {/* Settings form */}
      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
        <div>
          <label htmlFor="name" className="label">
            Tên workspace
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="input"
            placeholder="My Workspace"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="slug" className="label">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            {...register('slug')}
            className="input"
            placeholder="my-workspace"
          />
          {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={updateWorkspace.isPending || !isDirty}
            className="btn-primary"
          >
            {updateWorkspace.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </button>
        </div>
      </form>

      {/* Danger zone — only visible for OWNER */}
      {isOwner && (
        <div className="mt-8 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Vùng nguy hiểm</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Xóa workspace sẽ xóa tất cả dữ liệu liên quan. Hành động này không thể hoàn tác.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Xóa workspace
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Nhập <strong className="text-red-600 dark:text-red-400">{workspace.name}</strong> để xác nhận xóa:
              </p>
              <input
                type="text"
                value={deleteConfirmName}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                className="input"
                placeholder={workspace.name}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirmName !== workspace.name || deleteWorkspace.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteWorkspace.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    'Xác nhận xóa'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmName('');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
