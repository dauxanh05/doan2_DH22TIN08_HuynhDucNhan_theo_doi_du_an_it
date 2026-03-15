import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Loader2, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useComments } from '@/hooks/useComments';
import { useCreateComment } from '@/hooks/useCreateComment';
import { useUpdateComment } from '@/hooks/useUpdateComment';
import { useDeleteComment } from '@/hooks/useDeleteComment';
import MentionInput from '@/features/tasks/MentionInput';

interface CommentSectionProps {
  taskId: string;
  projectId: string;
}

function highlightMentions(text: string) {
  const parts = text.split(/(@\S+)/g);
  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      return (
        <span key={index} className="text-indigo-600 font-medium dark:text-indigo-400">
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function CommentSection({ taskId }: CommentSectionProps) {
  const currentUser = useAuthStore((state) => state.user);
  const { data: comments, isLoading } = useComments(taskId);
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const [newContent, setNewContent] = useState('');
  const [newMentions, setNewMentions] = useState<string[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editMentions, setEditMentions] = useState<string[]>([]);

  const handleSubmit = () => {
    const trimmed = newContent.trim();
    if (!trimmed) return;

    createComment.mutate(
      { taskId, data: { content: trimmed, mentions: newMentions } },
      {
        onSuccess: () => {
          setNewContent('');
          setNewMentions([]);
        },
      },
    );
  };

  const handleEdit = (commentId: string) => {
    updateComment.mutate(
      { taskId, commentId, data: { content: editContent.trim(), mentions: editMentions } },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditContent('');
          setEditMentions([]);
        },
      },
    );
  };

  const handleDelete = (commentId: string) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa bình luận này?');
    if (!confirmed) return;
    deleteComment.mutate({ taskId, commentId });
  };

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Bình luận {comments && comments.length > 0 ? `(${comments.length})` : ''}
        </h3>
      </div>

      {/* Comment list */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {/* Avatar */}
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                {comment.user.name.charAt(0).toUpperCase()}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {comment.user.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </span>
                  {comment.updatedAt !== comment.createdAt && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">(đã sửa)</span>
                  )}
                </div>

                {/* Nội dung / Edit inline */}
                {editingId === comment.id ? (
                  <div className="mt-2 space-y-2">
                    <MentionInput
                      value={editContent}
                      onChange={setEditContent}
                      onMentionAdd={(userId) =>
                        setEditMentions((prev) =>
                          prev.includes(userId) ? prev : [...prev, userId],
                        )
                      }
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(comment.id)}
                        disabled={updateComment.isPending || !editContent.trim()}
                        className="btn-primary text-xs py-1 px-3"
                      >
                        {updateComment.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          'Lưu'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditContent('');
                          setEditMentions([]);
                        }}
                        className="text-xs py-1 px-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                    {highlightMentions(comment.content)}
                  </p>
                )}

                {/* Actions — chỉ cho comment của mình */}
                {currentUser?.id === comment.userId && editingId !== comment.id && (
                  <div className="mt-1 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                        setEditMentions([...comment.mentions]);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <Pencil className="w-3 h-3" />
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      disabled={deleteComment.isPending}
                      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">Chưa có bình luận nào.</p>
      )}

      {/* New comment form */}
      <div className="space-y-2 pt-1">
        <MentionInput
          value={newContent}
          onChange={setNewContent}
          onMentionAdd={(userId) =>
            setNewMentions((prev) => (prev.includes(userId) ? prev : [...prev, userId]))
          }
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={createComment.isPending || !newContent.trim()}
            className="btn-primary"
          >
            {createComment.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Gửi'}
          </button>
        </div>
      </div>
    </section>
  );
}
