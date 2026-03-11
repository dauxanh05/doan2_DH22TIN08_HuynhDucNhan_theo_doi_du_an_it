import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Image as ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { workspacePresets } from '@/assets/workspace-presets';
import { useUpdateWorkspace } from '@/hooks/useUpdateWorkspace';
import { useUploadWorkspaceLogo } from '@/hooks/useUploadWorkspaceLogo';

interface LogoPickerProps {
  workspaceId: string;
  currentLogo: string | null;
  workspaceName: string;
}

type Tab = 'upload' | 'preset';

export default function LogoPicker({ workspaceId, currentLogo, workspaceName }: LogoPickerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('preset');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [displayLogo, setDisplayLogo] = useState<string | null>(currentLogo);
  const [cropState, setCropState] = useState<{ show: boolean; imageUrl: string }>({
    show: false,
    imageUrl: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const uploadLogo = useUploadWorkspaceLogo();
  const updateWorkspace = useUpdateWorkspace();

  useEffect(() => {
    setDisplayLogo(currentLogo);
  }, [currentLogo]);

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
    setDisplayLogo(currentLogo);

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

      const croppedFile = new File([blob], 'workspace-logo.png', { type: 'image/png' });
      const nextPreviewUrl = canvas.toDataURL('image/png');

      setSelectedFile(croppedFile);
      setPreviewUrl(nextPreviewUrl);
      setDisplayLogo(nextPreviewUrl);
      resetCropState();
    }, 'image/png');
  }, [cropState.imageUrl]);

  const handleCancelCrop = () => {
    resetCropState();
    clearFileInput();
  };

  const handleUpload = (file: File) => {
    const optimisticPreview = previewUrl;

    if (optimisticPreview) {
      setDisplayLogo(optimisticPreview);
    }

    uploadLogo.mutate(
      { workspaceId, file },
      {
        onSuccess: (data) => {
          setDisplayLogo(data.logo || optimisticPreview || currentLogo);
          resetUploadState();
        },
        onError: () => {
          setDisplayLogo(currentLogo);
        },
      },
    );
  };

  const handlePresetSelect = (presetSrc: string) => {
    setDisplayLogo(presetSrc);

    updateWorkspace.mutate(
      {
        workspaceId,
        data: { logo: presetSrc },
      },
      {
        onError: () => {
          setDisplayLogo(currentLogo);
        },
      },
    );
  };

  const handleCancelPreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDisplayLogo(currentLogo);
    clearFileInput();
  };

  const visualLogo = displayLogo || currentLogo;
  const isUpdating = uploadLogo.isPending || updateWorkspace.isPending;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {visualLogo ? (
          <img
            src={visualLogo}
            alt={workspaceName}
            className="h-16 w-16 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-200 bg-indigo-100 text-2xl font-semibold text-indigo-600 dark:border-gray-700 dark:bg-indigo-900 dark:text-indigo-400">
            {workspaceName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Logo workspace</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Chọn ảnh có sẵn hoặc upload ảnh từ máy
          </p>
        </div>
      </div>

      <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab('preset')}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            activeTab === 'preset'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Ảnh có sẵn
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

      {activeTab === 'preset' && (
        <div className="grid grid-cols-4 gap-3">
          {workspacePresets.map((preset) => {
            const isActive = visualLogo === preset.src;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset.src)}
                disabled={isUpdating}
                className={`group relative rounded-lg border p-2 transition-all disabled:opacity-50 ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 dark:bg-indigo-900/20 dark:ring-indigo-800'
                    : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-700 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20'
                }`}
              >
                <img
                  src={preset.src}
                  alt={preset.name}
                  className="aspect-square w-full rounded object-contain"
                />
                <p className="mt-1 text-center text-xs text-gray-600 dark:text-gray-400">{preset.name}</p>
              </button>
            );
          })}
        </div>
      )}

      {activeTab === 'upload' && (
        <div>
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

          {previewUrl && selectedFile && !cropState.show && (
            <div className="mb-4">
              <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">Xem trước:</p>
              <div className="flex items-center gap-4">
                <img
                  src={previewUrl}
                  alt="Cropped preview"
                  className="h-16 w-16 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpload(selectedFile)}
                    disabled={uploadLogo.isPending}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {uploadLogo.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Lưu logo
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

          {!cropState.show && !previewUrl && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-indigo-400 dark:border-gray-600 dark:hover:border-indigo-500"
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
        </div>
      )}

      {isUpdating && activeTab === 'preset' && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang cập nhật logo...
        </div>
      )}
    </div>
  );
}
