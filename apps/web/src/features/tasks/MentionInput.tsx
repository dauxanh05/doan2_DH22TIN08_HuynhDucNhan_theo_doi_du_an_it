import { useEffect, useRef, useState } from 'react';
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers';
import { useWorkspaceStore } from '@/stores/workspace.store';

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onMentionAdd: (userId: string) => void;
  placeholder?: string;
}

export default function MentionInput({
  value,
  onChange,
  onMentionAdd,
  placeholder = 'Viết bình luận... (gõ @ để tag người)',
}: MentionInputProps) {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const { data: members } = useWorkspaceMembers(currentWorkspace?.id);

  const [mentionQuery, setMentionQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    onChange(newValue);

    // Detect @ mention — tìm @ gần cursor nhất
    const cursorPos = event.target.selectionStart ?? newValue.length;
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(atIndex + 1);
      // Chỉ hiện dropdown nếu chưa có space sau @
      if (!textAfterAt.includes(' ')) {
        setMentionQuery(textAfterAt.toLowerCase());
        setMentionStartIndex(atIndex);
        setShowDropdown(true);
        return;
      }
    }

    setShowDropdown(false);
    setMentionStartIndex(-1);
  };

  const handleSelectMember = (userId: string, name: string) => {
    if (mentionStartIndex === -1) return;

    // Thay @query bằng @Tên
    const before = value.slice(0, mentionStartIndex);
    const after = value.slice(mentionStartIndex + 1 + mentionQuery.length);
    const newValue = `${before}@${name}${after}`;

    onChange(newValue);
    onMentionAdd(userId);
    setShowDropdown(false);
    setMentionQuery('');
    setMentionStartIndex(-1);

    // Focus lại textarea
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const filteredMembers = (members ?? []).filter((member) =>
    member.user.name.toLowerCase().includes(mentionQuery),
  );

  return (
    <div ref={containerRef} className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={3}
        className="input resize-none w-full"
      />

      {showDropdown && filteredMembers.length > 0 && (
        <div className="absolute z-20 bottom-full mb-1 left-0 w-64 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <ul className="py-1 max-h-48 overflow-y-auto">
            {filteredMembers.map((member) => (
              <li key={member.userId}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    // Dùng onMouseDown để tránh blur textarea trước khi click
                    e.preventDefault();
                    handleSelectMember(member.userId, member.user.name);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 shrink-0">
                    {member.user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-gray-900 dark:text-white truncate">{member.user.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
