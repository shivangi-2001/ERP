import React from "react";

interface TextareaProps {
  id: string;
  name?: string; // Added name prop for compatibility
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void; // Returns String only
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

const TextArea: React.FC<TextareaProps> = ({
  id = "",
  name,
  placeholder = "Enter your message",
  rows = 3,
  value = "",
  onChange,
  className = "",
  disabled = false,
  error = false,
  hint = "",
}) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      // We pass only the value string to the parent
      onChange(e.target.value);
    }
  };

  let textareaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${className} `;

  if (disabled) {
    textareaClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    textareaClasses += ` bg-transparent border-red-300 focus:border-red-500 focus:ring-3 focus:ring-red-500/10 dark:border-red-800 dark:bg-gray-900 dark:text-white/90`;
  } else {
    textareaClasses += ` bg-transparent text-gray-900 dark:text-gray-300 border-gray-300 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90`;
  }

  return (
    <div className="relative w-full">
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={textareaClasses}
      />
      {hint && (
        <p
          className={`mt-2 text-xs ${
            error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;