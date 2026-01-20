import { BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const stats = [
  { name: 'Tổng dự án', value: '12', icon: BarChart3, color: 'bg-blue-500' },
  { name: 'Hoàn thành', value: '8', icon: CheckCircle, color: 'bg-green-500' },
  { name: 'Đang thực hiện', value: '3', icon: Clock, color: 'bg-yellow-500' },
  { name: 'Quá hạn', value: '1', icon: AlertCircle, color: 'bg-red-500' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tổng quan về tiến độ dự án của bạn
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tasks theo trạng thái
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart sẽ được thêm sau
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tiến độ dự án
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart sẽ được thêm sau
          </div>
        </div>
      </div>

      {/* Recent tasks */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tasks gần đây
        </h3>
        <div className="text-center py-12 text-gray-400">
          Chưa có task nào. Hãy tạo dự án đầu tiên!
        </div>
      </div>
    </div>
  );
}
