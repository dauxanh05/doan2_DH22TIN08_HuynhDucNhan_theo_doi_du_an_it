import { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Bell, Loader2, MessageSquare, UserPlus } from 'lucide-react';
import { useMarkAllRead } from '@/hooks/useMarkAllRead';
import { useMarkRead } from '@/hooks/useMarkRead';
import { useNotifications } from '@/hooks/useNotifications';
import type { Notification } from '@/hooks/useNotifications';

interface NotificationDropdownProps {
  onClose: () => void;
}

function NotificationIcon({ type }: { type: string }) {
  if (type === 'TASK_ASSIGNED') {
    return <UserPlus className="w-4 h-4" />;
  }
  if (type === 'COMMENT_ADDED') {
    return <MessageSquare className="w-4 h-4" />;
  }
  return <Bell className="w-4 h-4" />;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside → đóng
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const hasUnread = (notifications ?? []).some((n: Notification) => !n.read);

  const handleItemClick = (notification: Notification) => {
    if (!notification.read) {
      markRead.mutate(notification.id);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Thông báo</h3>
        <button
          type="button"
          onClick={() => markAllRead.mutate()}
          disabled={!hasUnread || markAllRead.isPending}
          className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {markAllRead.isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            'Đánh dấu tất cả đã đọc'
          )}
        </button>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Không có thông báo nào.
          </p>
        ) : (
          <ul>
            {notifications.map((notification: Notification) => (
              <li key={notification.id}>
                <button
                  type="button"
                  onClick={() => handleItemClick(notification)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    !notification.read
                      ? 'bg-indigo-50 dark:bg-indigo-950/30'
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  {/* Icon */}
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      !notification.read
                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <NotificationIcon type={notification.type} />
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium leading-snug ${
                        !notification.read
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notification.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
