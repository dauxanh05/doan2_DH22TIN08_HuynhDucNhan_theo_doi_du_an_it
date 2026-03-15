import { useNavigate } from 'react-router-dom';
import type { ProjectProgress } from '@/hooks/useDashboardStats';

interface Props {
  projects: ProjectProgress[];
}

export default function ProjectProgressWidget({ projects }: Props) {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tiến độ dự án
        </h3>
        <div className="text-center py-8 text-gray-400">Chưa có dự án</div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Tiến độ dự án
      </h3>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.projectId}
            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -mx-2 transition-colors"
            onClick={() => navigate(`/projects/${project.projectId}`)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {project.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 shrink-0">
                {project.percentage}%
              </span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="rounded-full h-2 transition-all duration-500"
                style={{
                  width: `${project.percentage}%`,
                  backgroundColor: project.color || '#6366F1',
                }}
              />
            </div>
            <div className="mt-1 text-xs text-gray-400">
              {project.completedTasks}/{project.totalTasks} tasks
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
