import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            DevTeamOS
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quản lý tiến độ dự án hiệu quả
          </p>
        </div>
        <div className="card p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
