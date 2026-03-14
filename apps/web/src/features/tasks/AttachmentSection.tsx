import { useMemo, useRef } from 'react';
import { Download, Loader2, Paperclip, Trash2, Upload } from 'lucide-react';
import { resolveApiAssetUrl } from '@/services/api';
import { useDeleteAttachment } from '@/hooks/useDeleteAttachment';
import { useUploadAttachment } from '@/hooks/useUploadAttachment';
import type { Attachment } from '@/hooks/useTask';

interface AttachmentSectionProps {
  projectId: string;
  taskId: string;
  attachments: Attachment[];
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentSection({
  projectId,
  taskId,
  attachments,
}: AttachmentSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAttachment = useUploadAttachment();
  const deleteAttachment = useDeleteAttachment();

  const normalizedAttachments = useMemo(
    () =>
      attachments.map((attachment) => ({
        ...attachment,
        resolvedPath: resolveApiAssetUrl(attachment.path) ?? attachment.path,
      })),
    [attachments],
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Attachments</h3>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;

              uploadAttachment.mutate({ projectId, taskId, file });
              event.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary"
            disabled={uploadAttachment.isPending}
          >
            {uploadAttachment.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </button>
        </div>
      </div>

      {normalizedAttachments.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Chưa có file đính kèm.</p>
      ) : (
        <div className="space-y-2">
          {normalizedAttachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2"
            >
              <Paperclip className="w-4 h-4 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {attachment.filename}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatBytes(attachment.size)}
                </p>
              </div>
              <a
                href={attachment.resolvedPath}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() =>
                  deleteAttachment.mutate({
                    projectId,
                    taskId,
                    attachmentId: attachment.id,
                  })
                }
                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
