import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2, AlertCircle } from 'lucide-react';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useWorkspaceStore } from '@/stores/workspace.store';
import CreateWorkspaceModal from '@/features/workspaces/CreateWorkspaceModal';

// Role badge color mapping
const roleBadgeColors: Record<string, string> = {
  OWNER: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
  ADMIN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  MEMBER: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  VIEWER: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const roleLabels: Record<string, string> = {
  OWNER: 'Chủ sở hữu',
  ADMIN: 'Quản trị',
  MEMBER: 'Thành viên',
  VIEWER: 'Xem',
};

export default function WorkspaceListPage() {
  const { data: workspaces, isLoading, isError } = useWorkspaces();
  const setCurrentWorkspace = useWorkspaceStore((s) => s.setCurrentWorkspace);
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  // Select workspace and navigate to dashboard
  const handleSelect = (ws: NonNullable<typeof workspaces>[number]) => {
    setCurrentWorkspace(ws);
    navigate('/');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workspaces</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo workspace mới
        </button>
      </div>

      {/* Error state */}
      {isError && (
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Không thể tải danh sách workspace
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Vui lòng thử lại sau.
          </p>
        </div>
      )}

      {/* Loading state — skeleton cards */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="card p-5 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && workspaces && workspaces.length === 0 && (
        <div className="text-center py-16">
          <Building2 className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Chưa có workspace nào
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Tạo workspace đầu tiên để bắt đầu quản lý dự án.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo workspace đầu tiên
          </button>
        </div>
      )}

      {/* Workspace grid */}
      {!isLoading && workspaces && workspaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => handleSelect(ws)}
              className="card p-5 text-left hover:ring-2 hover:ring-indigo-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                {/* Logo or initial avatar */}
                {ws.logo ? (
                  <img
                    src={ws.logo}
                    alt={ws.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {ws.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {ws.slug}
                  </p>
                </div>
              </div>

              {/* Role badge */}
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${roleBadgeColors[ws.role] || roleBadgeColors.VIEWER}`}
              >
                {roleLabels[ws.role] || ws.role}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Create workspace modal */}
      <CreateWorkspaceModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
