import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, Building2 } from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspace.store';

// Role badge colors (compact version for dropdown items)
const roleBadgeColors: Record<string, string> = {
  OWNER: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
  ADMIN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  MEMBER: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  VIEWER: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const roleLabels: Record<string, string> = {
  OWNER: 'Chủ sở hữu',
  ADMIN: 'Quản trị',
  MEMBER: 'Thành viên',
  VIEWER: 'Xem',
};

export default function WorkspaceSwitcher() {
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);
  const switchWorkspace = useWorkspaceStore((s) => s.switchWorkspace);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle workspace selection
  const handleSelect = (workspaceId: string) => {
    switchWorkspace(workspaceId);
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {/* Workspace logo or initial */}
        {currentWorkspace ? (
          currentWorkspace.logo ? (
            <img
              src={currentWorkspace.logo}
              alt={currentWorkspace.name}
              className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm flex-shrink-0">
              {currentWorkspace.name.charAt(0).toUpperCase()}
            </div>
          )
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-gray-400" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {currentWorkspace?.name || 'Chọn workspace'}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
          {/* Workspace list */}
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => handleSelect(ws.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                currentWorkspace?.id === ws.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
              }`}
            >
              {/* Logo or initial */}
              {ws.logo ? (
                <img
                  src={ws.logo}
                  alt={ws.name}
                  className="w-7 h-7 rounded-md object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-md bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-xs flex-shrink-0">
                  {ws.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {ws.name}
                </p>
              </div>

              {/* Role badge */}
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0 ${roleBadgeColors[ws.role] || roleBadgeColors.VIEWER}`}
              >
                {roleLabels[ws.role] || ws.role}
              </span>
            </button>
          ))}

          {/* Divider */}
          {workspaces.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
          )}

          {/* Create new workspace link */}
          <button
            onClick={() => {
              setIsOpen(false);
              navigate('/workspaces');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-indigo-600 dark:text-indigo-400"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Tạo workspace mới</span>
          </button>
        </div>
      )}
    </div>
  );
}
