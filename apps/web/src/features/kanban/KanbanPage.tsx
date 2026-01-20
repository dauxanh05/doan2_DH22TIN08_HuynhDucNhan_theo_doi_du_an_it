import { Plus } from 'lucide-react';

const columns = [
  { id: 'todo', name: 'Cần làm', color: 'bg-gray-400' },
  { id: 'in_progress', name: 'Đang làm', color: 'bg-blue-500' },
  { id: 'done', name: 'Hoàn thành', color: 'bg-green-500' },
];

export default function KanbanPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Kanban Board
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kéo thả để di chuyển tasks giữa các cột
        </p>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 bg-gray-100 dark:bg-gray-800 rounded-xl p-4"
          >
            {/* Column header */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {column.name}
              </h3>
              <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                0
              </span>
            </div>

            {/* Add task button */}
            <button className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Thêm task
            </button>

            {/* Tasks placeholder */}
            <div className="mt-4 space-y-3">
              {/* Task cards will be rendered here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
