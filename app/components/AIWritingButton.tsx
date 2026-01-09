"use client";

import { Icon } from "./Icon";

interface AIWritingButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isQuoteField?: boolean;
}

export function AIWritingButton({
  onClick,
  disabled = false,
  isQuoteField = false,
}: AIWritingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title={isQuoteField ? "Generate quote with AI" : "Improve with AI"}
    >
      <Icon
        name="lucide:sparkles"
        size={14}
        className="group-hover:scale-110 transition-transform"
      />
      <span>{isQuoteField ? "Generate" : "AI"}</span>
    </button>
  );
}
