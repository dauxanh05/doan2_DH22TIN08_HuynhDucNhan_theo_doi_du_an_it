import { Check } from 'lucide-react';

const PRESET_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#6b7280', // gray
];

interface ColorPresetPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPresetPicker({ value, onChange }: ColorPresetPickerProps) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {PRESET_COLORS.map((color) => {
          const isActive = value === color;

          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`relative h-9 w-full rounded-lg border-2 transition-all ${
                isActive
                  ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-400 dark:border-white dark:ring-gray-600'
                  : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            >
              {isActive && (
                <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        Đang chọn: <span className="font-mono">{value}</span>
      </p>
    </div>
  );
}
