"use client";

interface PrivacyToggleProps {
  isPrivate: boolean;
  onChange: (val: boolean) => void;
}

export function PrivacyToggle({ isPrivate, onChange }: PrivacyToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={isPrivate}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded accent-brand-500"
      />
      <span className="text-sm text-gray-500">
        {isPrivate ? "🔒 仅自己可见" : "👥 室友可见"}
      </span>
    </label>
  );
}
