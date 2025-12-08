import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons"; // Assuming you have this, or use a Clock icon

type PropsType = {
  id: string;
  onChange?: (date: string) => void;
  defaultDate?: string;
  label?: string;
  placeholder?: string;
  error?: boolean;
  enableTime?: boolean; 
  disabled?: boolean;
};

export default function DatePicker({
  id,
  onChange,
  label,
  defaultDate,
  placeholder,
  error,
  enableTime = false, 
  disabled=false
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const fp = flatpickr(inputRef.current, {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      // If time is enabled, use DateTime format, otherwise just Date
      dateFormat: enableTime ? "Y-m-d H:i" : "Y-m-d",
      enableTime: enableTime, 
      time_24hr: true, // Optional: Use 24h format (14:00) instead of AM/PM
      defaultDate: defaultDate,
      onChange: (selectedDates, dateStr) => {
        if (onChange) onChange(dateStr);
      },
    });

    return () => {
      fp.destroy();
    };
  }, [onChange, defaultDate, enableTime]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          type="button"
          ref={inputRef}
          id={id}
          placeholder={placeholder}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800 ${
            error ? "border-error-500" : "border-gray-300"
          }`}
          disabled={disabled}
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}