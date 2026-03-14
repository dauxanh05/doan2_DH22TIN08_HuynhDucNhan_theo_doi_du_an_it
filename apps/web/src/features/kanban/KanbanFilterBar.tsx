import { useCallback, useEffect, useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import type { Task } from '@/hooks/useTasks';

const priorityOptions = [
  { value: 'URGENT' as const, label: 'Khẩn cấp', className: 'bg-red-500' },
  { value: 'HIGH' as const, label: 'Cao', className: 'bg-orange-500' },
  { value: 'MEDIUM' as const, label: 'Trung bình', className: 'bg-blue-500' },
  { value: 'LOW' as const, label: 'Thấp', className: 'bg-gray-400' },
];

interface AssigneeOption {
  userId: string;
  name: string;
}

export interface KanbanFilters {
  assignees: string[];
  priorities: Task['priority'][];
  search: string;
}

interface KanbanFilterBarProps {
  tasks: Task[];
  filters: KanbanFilters;
  onFiltersChange: (filters: KanbanFilters) => void;
}

export default function KanbanFilterBar({ tasks, filters, onFiltersChange }: KanbanFilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  // Extract unique assignees from tasks
  const assigneeOptions: AssigneeOption[] = [];
  const seenIds = new Set<string>();
  for (const task of tasks) {
    for (const assignee of task.assignees ?? []) {
      if (!seenIds.has(assignee.userId)) {
        seenIds.add(assignee.userId);
        assigneeOptions.push({ userId: assignee.userId, name: assignee.user.name });
      }
    }
  }

  // Debounce search 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchInput });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const handleAssigneesChange = useCallback(
    (values: string[]) => {
      onFiltersChange({ ...filters, assignees: values });
    },
    [filters, onFiltersChange],
  );

  const handlePrioritiesChange = useCallback(
    (values: Task['priority'][]) => {
      onFiltersChange({ ...filters, priorities: values });
    },
    [filters, onFiltersChange],
  );

  const hasActiveFilters =
    filters.assignees.length > 0 || filters.priorities.length > 0 || filters.search.length > 0;

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({ assignees: [], priorities: [], search: '' });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Assignee filter */}
      <Listbox value={filters.assignees} onChange={handleAssigneesChange} multiple>
        <div className="relative">
          <ListboxButton className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <span>
              {filters.assignees.length > 0
                ? `Người thực hiện (${filters.assignees.length})`
                : 'Người thực hiện'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </ListboxButton>
          <ListboxOptions className="absolute z-20 mt-1 max-h-60 w-56 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {assigneeOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">Chưa có ai được gán</div>
            ) : (
              assigneeOptions.map((opt) => (
                <ListboxOption
                  key={opt.userId}
                  value={opt.userId}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 data-[focus]:bg-indigo-50 dark:text-gray-300 dark:data-[focus]:bg-indigo-950/30"
                >
                  {({ selected }) => (
                    <>
                      <div
                        className={`h-4 w-4 rounded border flex items-center justify-center ${
                          selected
                            ? 'border-indigo-500 bg-indigo-500 text-white'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </div>
                      <span>{opt.name}</span>
                    </>
                  )}
                </ListboxOption>
              ))
            )}
          </ListboxOptions>
        </div>
      </Listbox>

      {/* Priority filter */}
      <Listbox value={filters.priorities} onChange={handlePrioritiesChange} multiple>
        <div className="relative">
          <ListboxButton className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <span>
              {filters.priorities.length > 0
                ? `Ưu tiên (${filters.priorities.length})`
                : 'Ưu tiên'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </ListboxButton>
          <ListboxOptions className="absolute z-20 mt-1 w-48 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {priorityOptions.map((opt) => (
              <ListboxOption
                key={opt.value}
                value={opt.value}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 data-[focus]:bg-indigo-50 dark:text-gray-300 dark:data-[focus]:bg-indigo-950/30"
              >
                {({ selected }) => (
                  <>
                    <div
                      className={`h-4 w-4 rounded border flex items-center justify-center ${
                        selected
                          ? 'border-indigo-500 bg-indigo-500 text-white'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </div>
                    <div className={`h-2.5 w-2.5 rounded-full ${opt.className}`} />
                    <span>{opt.label}</span>
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>

      {/* Search input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Tìm kiếm task..."
          className="rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500 w-52"
        />
      </div>

      {/* Clear filters button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors dark:text-gray-400 dark:hover:text-red-400"
        >
          <X className="h-4 w-4" />
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}
