import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MemberWorkload } from '@/hooks/useDashboardStats';

interface Props {
  memberWorkload: MemberWorkload[];
}

export default function MemberWorkloadChart({ memberWorkload }: Props) {
  if (memberWorkload.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Khối lượng công việc
        </h3>
        <div className="text-center py-8 text-gray-400">
          Chưa có dữ liệu thành viên
        </div>
      </div>
    );
  }

  const sorted = [...memberWorkload].sort(
    (a, b) => b.activeTasks - a.activeTasks,
  );

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Khối lượng công việc
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={sorted} margin={{ left: 20 }}>
            <XAxis type="number" allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
              }}
              formatter={(value: number) => [`${value} tasks`, 'Đang làm']}
            />
            <Bar
              dataKey="activeTasks"
              fill="#6366F1"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
