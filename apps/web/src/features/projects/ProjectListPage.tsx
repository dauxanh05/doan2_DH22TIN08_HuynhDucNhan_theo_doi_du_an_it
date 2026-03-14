import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, FolderKanban, Plus } from 'lucide-react';
import CreateProjectModal from '@/features/projects/CreateProjectModal';
import { useProjects } from '@/hooks/useProjects';
import { resolveApiAssetUrl } from '@/services/api';

const statusLabels: Record<string, string> = {
  ACTIVE: 'Đang hoạt động',
  COMPLETED: 'Hoàn thành',
  ARCHIVED: 'Lưu trữ',
};

export default function ProjectListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: projects, isLoading, isError } = useProjects(id);
  const [showCreate, setShowCreate] = useState(false);

  if (!id) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Không tìm thấy workspace
        </h3>
        <p className="text-gray-500 dark:text-gray-400">Vui lòng chọn workspace hợp lệ.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dự án</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý danh sách dự án trong workspace hiện tại.
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Tạo dự án mới
        </button>
      </div>

      {isError && (
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Không thể tải danh sách dự án
          </h3>
          <p className="text-gray-500 dark:text-gray-400">Vui lòng thử lại sau.</p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card p-5 animate-pulse">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && projects && projects.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <FolderKanban className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Chưa có dự án nào
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Bắt đầu bằng cách tạo dự án đầu tiên cho workspace này.
          </p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Tạo dự án đầu tiên
          </button>
        </div>
      )}

      {!isLoading && projects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="card p-5 text-left hover:ring-2 hover:ring-indigo-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3 mb-4">
                {project.image ? (
                  <img
                    src={resolveApiAssetUrl(project.image) ?? project.image}
                    alt={project.name}
                    className="h-10 w-10 rounded-xl border border-gray-200 object-cover flex-shrink-0 dark:border-gray-700"
                  />
                ) : project.icon ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xl flex-shrink-0 dark:border-gray-700 dark:bg-gray-900">
                    {project.icon}
                  </div>
                ) : (
                  <div
                    className="h-10 w-10 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{project.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-10">
                    {project.description || 'Chưa có mô tả cho dự án này.'}
                  </p>
                </div>
              </div>

              <span className="inline-flex px-2.5 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                {statusLabels[project.status] || project.status}
              </span>
            </button>
          ))}
        </div>
      )}

      <CreateProjectModal workspaceId={id} isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
