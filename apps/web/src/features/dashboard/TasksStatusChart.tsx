import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { TasksByStatus } from '@/hooks/useDashboardStats';

interface Props {
  tasksByStatus: TasksByStatus;
}

const STATUS_CONFIG = [
  { key: 'TODO' as const, name: 'Cần làm', fill: '#9CA3AF' },
  { key: 'IN_PROGRESS' as const, name: 'Đang làm', fill: '#3B82F6' },
  { key: 'DONE' as const, name: 'Hoàn thành', fill: '#22C55E' },
];

export default function TasksStatusChart({ tasksByStatus }: Props) {
  const total =
    tasksByStatus.TODO + tasksByStatus.IN_PROGRESS + tasksByStatus.DONE;

  if (total === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tasks theo trạng thái
        </h3>
        <div className="text-center py-8 text-gray-400">
          Chưa có task nào
        </div>
      </div>
    );
  }

  const data = STATUS_CONFIG.map((s) => ({
    name: s.name,
    value: tasksByStatus[s.key],
    fill: s.fill,
  }));

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Tasks theo trạng thái
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            {/* Center label showing total */}
            <text
              x="50%"
              y="47%"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-gray-900 dark:fill-white"
              fontSize={24}
              fontWeight={700}
            >
              {total}
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-gray-400"
              fontSize={12}
            >
              tasks
            </text>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
