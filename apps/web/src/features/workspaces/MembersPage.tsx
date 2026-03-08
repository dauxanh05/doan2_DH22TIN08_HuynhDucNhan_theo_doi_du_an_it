import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserPlus, Crown, Trash2, Loader2, ChevronDown, AlertCircle } from 'lucide-react';
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers';
import { useRemoveMember } from '@/hooks/useRemoveMember';
import { useUpdateMemberRole } from '@/hooks/useUpdateMemberRole';
import { useAuthStore } from '@/stores/auth.store';
import { useWorkspaceStore } from '@/stores/workspace.store';
import InviteMemberModal from '@/features/workspaces/InviteMemberModal';

// Role badge color mapping
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

// Available roles for dropdown (exclude OWNER)
const assignableRoles = ['ADMIN', 'MEMBER', 'VIEWER'] as const;

export default function MembersPage() {
  const { id } = useParams<{ id: string }>();
  const { data: members, isLoading, isError } = useWorkspaceMembers(id);
  const removeMember = useRemoveMember();
  const updateRole = useUpdateMemberRole();
  const user = useAuthStore((s) => s.user);
  const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);
  const [showInvite, setShowInvite] = useState(false);

  // Derive role from members data (not global store)
  const myMembership = members?.find((m) => m.userId === user?.id);
  const canManage = myMembership?.role === 'OWNER' || myMembership?.role === 'ADMIN';

  // Track which member's role dropdown is open
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenRoleDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle role change
  const handleRoleChange = (userId: string, newRole: 'ADMIN' | 'MEMBER' | 'VIEWER') => {
    if (!id) return;
    updateRole.mutate({
      workspaceId: id,
      userId,
      data: { role: newRole },
    });
    setOpenRoleDropdown(null);
  };

  // Handle remove member
  const handleRemove = (userId: string) => {
    if (!id) return;
    removeMember.mutate({ workspaceId: id, userId });
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/workspaces" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Workspaces
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{currentWorkspace?.name || 'Workspace'}</span>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">Thành viên</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thành viên</h1>
        {canManage && (
          <button
            onClick={() => setShowInvite(true)}
            className="btn-primary"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Mời thành viên
          </button>
        )}
      </div>

      {/* Error state */}
      {isError && (
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Không thể tải danh sách thành viên
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Vui lòng thử lại sau.
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      )}

      {/* Members list */}
      {!isLoading && members && (
        <div className="card divide-y divide-gray-200 dark:divide-gray-700">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-4"
            >
              {/* Avatar */}
              {member.user.avatar ? (
                <img
                  src={member.user.avatar}
                  alt={member.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Name & Email */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {member.user.name}
                  </p>
                  {member.role === 'OWNER' && (
                    <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {member.user.email}
                </p>
              </div>

              {/* Joined date */}
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                {formatDate(member.joinedAt)}
              </span>

              {/* Role badge / dropdown */}
              <div className="relative" ref={openRoleDropdown === member.userId ? dropdownRef : null}>
                {canManage && member.role !== 'OWNER' ? (
                  <>
                    <button
                      onClick={() =>
                        setOpenRoleDropdown(openRoleDropdown === member.userId ? null : member.userId)
                      }
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${roleBadgeColors[member.role] || roleBadgeColors.VIEWER}`}
                    >
                      {roleLabels[member.role] || member.role}
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {/* Role dropdown */}
                    {openRoleDropdown === member.userId && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1">
                        {assignableRoles.map((role) => (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(member.userId, role)}
                            className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              member.role === role
                                ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {roleLabels[role]}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${roleBadgeColors[member.role] || roleBadgeColors.VIEWER}`}
                  >
                    {roleLabels[member.role] || member.role}
                  </span>
                )}
              </div>

              {/* Remove button — only for OWNER/ADMIN, cannot remove OWNER */}
              {canManage && member.role !== 'OWNER' && (
                <button
                  onClick={() => handleRemove(member.userId)}
                  disabled={removeMember.isPending}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Xóa thành viên"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* Empty members (unlikely but handle) */}
          {members.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Chưa có thành viên nào.
            </div>
          )}
        </div>
      )}

      {/* Invite member modal */}
      {id && (
        <InviteMemberModal
          isOpen={showInvite}
          onClose={() => setShowInvite(false)}
          workspaceId={id}
        />
      )}
    </div>
  );
}
