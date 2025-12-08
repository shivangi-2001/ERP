import type React from "react";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  color?: "primary" | "warning" | "success" | "error"; 
  className?: string;
  id?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label = "",
  checked,
  id,
  onChange,
  className = "",
  disabled = false,
  color = "primary",
}) => {
  
  const colorClasses = {
    primary: "checked:bg-brand-500 dark:checked:bg-brand-500", // Or checked:bg-blue-500
    warning: "checked:bg-warning-500 dark:checked:bg-warning-500", // Or checked:bg-orange-500
    success: "checked:bg-success-500 dark:checked:bg-success-500", // Or checked:bg-green-500
    error:   "checked:bg-error-500 dark:checked:bg-error-500",     // Or checked:bg-red-500
  };

  return (
    <label
      className={`flex items-center space-x-3 group cursor-pointer ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      } ${className}`} // Applied className to root for better layout control
    >
      <div className="relative w-5 h-5">
        <input
          id={id}
          type="checkbox"
          className={`
            peer w-5 h-5 appearance-none rounded-md border border-gray-300 
            cursor-pointer bg-transparent
            dark:border-gray-700 
            checked:border-transparent 
            disabled:cursor-not-allowed
            transition-all duration-200
            ${colorClasses[color]} 
          `}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        
        {/* 2. OPTIMIZED: Single SVG logic */}
        {/* We only render the checkmark if checked. logic handles the color/stroke */}
        <svg
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none
            opacity-0 peer-checked:opacity-100 transition-opacity duration-200
            ${disabled ? "text-gray-300" : "text-white"}
          `}
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {label && (
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 select-none">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;