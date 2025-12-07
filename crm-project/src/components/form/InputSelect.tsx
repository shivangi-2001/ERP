import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface AutocompleteProps {
  options: Option[];
  placeholder?: string;
  onSelect: (value: Option) => void;
  defaultValue?: string; // This expects the LABEL (text), not the ID
  name: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint: string;
}

const InputSelect: React.FC<AutocompleteProps> = ({
  options,
  placeholder = "Select an option",
  onSelect,
  defaultValue = "",
  name = "",
  disabled = false,
  success = false,
  error = false,
  hint = "",
}) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // FIX 1: Sync local state when defaultValue prop changes (e.g., API loads)
  useEffect(() => {
    setInputValue(defaultValue || "");
  }, [defaultValue]);

  // FIX 2: Sync options if they load asynchronously while the dropdown is already open
  useEffect(() => {
    if (isDropdownOpen) {
      filterOptions(inputValue);
    }
  }, [options]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper to filter options
  const filterOptions = (query: string) => {
    if (!query) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsDropdownOpen(true);
    filterOptions(value);
  };

  // FIX 3: Initialize options when user clicks/focuses the input
  const handleFocus = () => {
    setIsDropdownOpen(true);
    filterOptions(inputValue);
  };

  const handleOptionClick = (option: Option) => {
    setInputValue(option.label);
    onSelect(option); // Passes the full option object back to parent
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        id={name}
        name={name}
        // Removed `defaultValue` attribute to avoid React conflict warning
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus} // Use the new handler
        disabled={disabled}
        autoComplete="off" // Prevents browser history from covering your dropdown
        className={`${
          disabled &&
          "text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
        } h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
      />

      {isDropdownOpen && !disabled && (
        <div className="absolute z-10 w-full rounded-b-lg border-t-0 border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 max-h-60 overflow-y-auto">
          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value} // Ensure this is unique
                  onClick={() => handleOptionClick(option)}
                  className="cursor-pointer px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-white/90 dark:hover:bg-gray-800 flex items-center gap-2"
                >
                  {option.icon && <span>{option.icon}</span>}
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default InputSelect;
