import { AlertCircle } from 'lucide-react';
import type { OverdueTask } from '@/hooks/useDashboardStats';

interface Props {
  overdueTasks: OverdueTask[];
}

export default function OverdueTasksWidget({ overdueTasks }: Props) {
  if (overdueTasks.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tasks quá hạn
          </h3>
        </div>
        <div className="text-center py-8 text-gray-400">
          Không có task quá hạn ✨
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tasks quá hạn
        </h3>
        <span className="ml-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-2 py-0.5 rounded-full">
          {overdueTasks.length}
        </span>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {overdueTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            onClick={() => console.log('Navigate to task', task.id)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {task.title}
              </p>
              <p className="text-xs text-red-500 mt-0.5">
                Quá hạn {task.daysOverdue} ngày
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {task.projectName}
              </p>
            </div>
            {task.assignees.length > 0 && (
              <div className="flex -space-x-1.5 shrink-0">
                {task.assignees.slice(0, 3).map((assignee) => (
                  <div
                    key={assignee.id}
                    title={assignee.name}
                    className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[10px] font-medium text-indigo-600 dark:text-indigo-400 ring-2 ring-white dark:ring-gray-800"
                  >
                    {assignee.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {task.assignees.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-[10px] font-medium text-gray-500 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
