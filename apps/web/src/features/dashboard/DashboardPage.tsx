import { useWorkspaceStore } from '@/stores/workspace.store';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import ProjectProgressWidget from './ProjectProgressWidget';
import TasksStatusChart from './TasksStatusChart';
import OverdueTasksWidget from './OverdueTasksWidget';
import MemberWorkloadChart from './MemberWorkloadChart';
import RecentActivityWidget from './RecentActivityWidget';

function SkeletonCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
      </div>
      <div className="mt-4 h-32 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}

export default function DashboardPage() {
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);
  const { data: stats, isLoading, isError } = useDashboardStats(currentWorkspace?.id);

  // No workspace selected
  if (!currentWorkspace) {
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
        <div className="card p-12 text-center">
          <p className="text-gray-400 text-lg">
            Chọn workspace để xem dashboard
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard — {currentWorkspace.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tổng quan về tiến độ dự án của bạn
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard />
      </div>
    );
  }

  // Error state
  if (isError || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard — {currentWorkspace.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tổng quan về tiến độ dự án của bạn
          </p>
        </div>
        <div className="card p-12 text-center">
          <p className="text-red-500">
            Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard — {currentWorkspace.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tổng quan về tiến độ dự án của bạn
        </p>
      </div>

      {/* Row 1: Project Progress + Tasks Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectProgressWidget projects={stats.projectsProgress} />
        <TasksStatusChart tasksByStatus={stats.tasksByStatus} />
      </div>

      {/* Row 2: Overdue Tasks + Member Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverdueTasksWidget overdueTasks={stats.overdueTasks} />
        <MemberWorkloadChart memberWorkload={stats.memberWorkload} />
      </div>

      {/* Row 3: Recent Activity (full width) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityWidget workspaceId={currentWorkspace.id} />
        </div>
      </div>
    </div>
  );
}
