import { Plus } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dự án
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý các dự án của bạn
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Tạo dự án
        </button>
      </div>

      {/* Empty state */}
      <div className="card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
          <Plus className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Chưa có dự án nào
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Bắt đầu bằng cách tạo dự án đầu tiên
        </p>
        <button className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Tạo dự án đầu tiên
        </button>
      </div>
    </div>
  );
}
