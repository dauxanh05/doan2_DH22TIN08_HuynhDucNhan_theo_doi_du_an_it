import { useState, useEffect, useCallback } from 'react';
import { Loader2, Activity as ActivityIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  useDashboardActivity,
  type Activity,
} from '@/hooks/useDashboardActivity';

interface Props {
  workspaceId: string | undefined;
}

export default function RecentActivityWidget({ workspaceId }: Props) {
  const [page, setPage] = useState(1);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const { data, isFetching } = useDashboardActivity(workspaceId, page);

  // Reset when workspace changes
  useEffect(() => {
    setPage(1);
    setAllActivities([]);
  }, [workspaceId]);

  // Append new data when page changes
  useEffect(() => {
    if (data?.data) {
      setAllActivities((prev) => {
        if (page === 1) return data.data;
        // Avoid duplicates
        const existingIds = new Set(prev.map((a) => a.id));
        const newItems = data.data.filter((a) => !existingIds.has(a.id));
        return [...prev, ...newItems];
      });
    }
  }, [data, page]);

  const hasMore = data ? allActivities.length < data.total : false;

  const handleLoadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  if (allActivities.length === 0 && !isFetching) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ActivityIcon className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Hoạt động gần đây
          </h3>
        </div>
        <div className="text-center py-8 text-gray-400">
          Chưa có hoạt động
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <ActivityIcon className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Hoạt động gần đây
        </h3>
      </div>
      <div className="space-y-3">
        {allActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-medium text-indigo-600 dark:text-indigo-400 shrink-0">
              {activity.userName.charAt(0).toUpperCase()}
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {activity.userName}
                </span>{' '}
                {activity.action}{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {activity.entityName}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDistanceToNow(new Date(activity.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors disabled:opacity-50"
          >
            {isFetching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tải...
              </>
            ) : (
              'Xem thêm'
            )}
          </button>
        </div>
      )}

      {/* Loading indicator for first page */}
      {isFetching && allActivities.length === 0 && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      )}
    </div>
  );
}
