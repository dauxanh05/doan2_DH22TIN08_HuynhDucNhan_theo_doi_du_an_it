import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Loader2, SmilePlus, Upload, X } from 'lucide-react';
import { resolveApiAssetUrl } from '@/services/api';
import { useUploadProjectImage } from '@/hooks/useUploadProjectImage';

const EMOJI_PRESETS = [
  '📁', '🚀', '🎯', '💡', '🔧', '🎮', '🎨', '📚',
  '💼', '🏗️', '📊', '🔬', '🌟', '⚡',
];

type Tab = 'emoji' | 'upload';

interface ProjectIconPickerProps {
  projectId?: string;
  workspaceId?: string;
  currentIcon: string | null;
  currentImage: string | null;
  onIconChange: (icon: string | null) => void;
  onImageChange?: (imagePath: string) => void;
}

export default function ProjectIconPicker({
  projectId,
  workspaceId,
  currentIcon,
  currentImage,
  onIconChange,
  onImageChange,
}: ProjectIconPickerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('emoji');
  const [displayImage, setDisplayImage] = useState<string | null>(currentImage);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropState, setCropState] = useState<{ show: boolean; imageUrl: string }>({
    show: false,
    imageUrl: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const uploadImage = useUploadProjectImage();

  useEffect(() => {
    setDisplayImage(currentImage);
  }, [currentImage]);

  useEffect(() => {
    return () => {
      if (cropState.imageUrl) {
        URL.revokeObjectURL(cropState.imageUrl);
      }
    };
  }, [cropState.imageUrl]);

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetCropState = () => {
    if (cropState.imageUrl) {
      URL.revokeObjectURL(cropState.imageUrl);
    }
    setCropState({ show: false, imageUrl: '' });
  };

  const resetUploadState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    resetCropState();
    clearFileInput();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    resetCropState();
    setSelectedFile(null);
    setPreviewUrl(null);
    setDisplayImage(currentImage);

    const url = URL.createObjectURL(file);
    setCropState({ show: true, imageUrl: url });
  };

  const handleCrop = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const size = 256;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const minDim = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - minDim) / 2;
    const sy = (img.naturalHeight - minDim) / 2;

    ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const croppedFile = new File([blob], 'project-image.png', { type: 'image/png' });
      const nextPreviewUrl = canvas.toDataURL('image/png');

      setSelectedFile(croppedFile);
      setPreviewUrl(nextPreviewUrl);
      setDisplayImage(nextPreviewUrl);
      resetCropState();
    }, 'image/png');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropState.imageUrl]);

  const handleCancelCrop = () => {
    resetCropState();
    clearFileInput();
  };

  const handleUpload = (file: File) => {
    if (!projectId || !workspaceId) return;

    const optimisticPreview = previewUrl;
    if (optimisticPreview) {
      setDisplayImage(optimisticPreview);
    }

    uploadImage.mutate(
      { projectId, workspaceId, file },
      {
        onSuccess: (data) => {
          setDisplayImage(data.image || optimisticPreview || currentImage);
          onImageChange?.(data.image);
          onIconChange(null);
          resetUploadState();
        },
        onError: () => {
          setDisplayImage(currentImage);
        },
      },
    );
  };

  const handleCancelPreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDisplayImage(currentImage);
    clearFileInput();
  };

  const resolvedImage = displayImage ? resolveApiAssetUrl(displayImage) : null;
  const isUploading = uploadImage.isPending;
  const canUpload = !!projectId;

  return (
    <div>
      {/* Preview current icon/image */}
      <div className="mb-4 flex items-center gap-4">
        {resolvedImage ? (
          <img
            src={resolvedImage}
            alt="Project"
            className="h-14 w-14 rounded-xl border border-gray-200 object-cover dark:border-gray-700"
          />
        ) : currentIcon ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-3xl dark:border-gray-700 dark:bg-gray-900">
            {currentIcon}
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800">
            <SmilePlus className="h-6 w-6" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Ảnh đại diện dự án</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Chọn emoji hoặc upload ảnh từ máy
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab('emoji')}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            activeTab === 'emoji'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <SmilePlus className="h-4 w-4" />
            Emoji
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </span>
        </button>
      </div>

      {/* Emoji tab */}
      {activeTab === 'emoji' && (
        <div>
          <div className="grid grid-cols-7 gap-2">
            {EMOJI_PRESETS.map((emoji) => {
              const isActive = currentIcon === emoji;

              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onIconChange(emoji)}
                  className={`flex h-10 w-full items-center justify-center rounded-lg border text-xl transition-all ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 dark:bg-indigo-900/20 dark:ring-indigo-800'
                      : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-700 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20'
                  }`}
                >
                  {emoji}
                </button>
              );
            })}
          </div>

          {currentIcon && (
            <button
              type="button"
              onClick={() => onIconChange(null)}
              className="mt-3 text-xs text-gray-500 transition-colors hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            >
              Xóa icon
            </button>
          )}
        </div>
      )}

      {/* Upload tab */}
      {activeTab === 'upload' && (
        <div>
          {!canUpload ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center dark:border-gray-600">
              <Upload className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bạn có thể upload ảnh sau khi tạo dự án.
              </p>
            </div>
          ) : (
            <>
              {/* Crop state */}
              {cropState.show && (
                <div className="mb-4">
                  <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                    Ảnh sẽ được crop vuông từ giữa. Bấm xác nhận để tiếp tục.
                  </p>
                  <div className="relative inline-block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <img
                      ref={imgRef}
                      src={cropState.imageUrl}
                      alt="Crop preview"
                      className="max-h-64 max-w-full object-contain"
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={handleCrop}
                      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-indigo-700"
                    >
                      <Check className="h-4 w-4" />
                      Xác nhận crop
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelCrop}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="h-4 w-4" />
                      Hủy
                    </button>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              {/* Preview after crop */}
              {previewUrl && selectedFile && !cropState.show && (
                <div className="mb-4">
                  <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">Xem trước:</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={previewUrl}
                      alt="Cropped preview"
                      className="h-14 w-14 rounded-xl border border-gray-200 object-cover dark:border-gray-700"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpload(selectedFile)}
                        disabled={isUploading}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            Lưu ảnh
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelPreview}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <X className="h-4 w-4" />
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Drop zone */}
              {!cropState.show && !previewUrl && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-indigo-400 dark:border-gray-600 dark:hover:border-indigo-500"
                >
                  <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bấm để chọn ảnh từ máy</p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    JPG, PNG, GIF, WebP (tối đa 2MB)
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
