import React, { useRef, useEffect, useState } from "react";
import Button from "../ui/button/Button";

export interface SearchResultItem {
  id?: string | number;
  label: string;
  value?: any;
}

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  
  // Search Input Props
  enableSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchResults?: SearchResultItem[]; 
  onSearchSelect?: (item: SearchResultItem) => void;
  searchPlaceholder?: string;

  // Button control
  buttonText?: string;
  onButtonClick?: () => void;
  buttonStartIcon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = "",
  desc = "",

  enableSearch = false,
  searchValue = "",
  onSearchChange,
  searchResults = [],
  onSearchSelect,
  searchPlaceholder = "Search...",

  buttonText = "",
  onButtonClick,
  buttonStartIcon
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Keyboard Shortcut (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Click Outside to Close Dropdown
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          searchContainerRef.current &&
          !searchContainerRef.current.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-open dropdown if there is text and results
  useEffect(() => {
    if (searchValue && searchResults.length > 0) {
      setIsDropdownOpen(true);
    } else if (!searchValue) {
      setIsDropdownOpen(false);
    }
  }, [searchValue, searchResults]);

  const handleSelectItem = (item: SearchResultItem) => {
    if (onSearchSelect) {
      onSearchSelect(item);
    }
    setIsDropdownOpen(false); // Close after selection
  };

  return (
    <div
      className={`h-fit rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>

        <div className="inline-flex items-center gap-4">
          {enableSearch && (
            <div className="relative" ref={searchContainerRef}>
              <div className="hidden md:block">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="fill-gray-500 dark:fill-gray-400"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                          fill=""
                        />
                      </svg>
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchValue}
                      // Pass the event directly to match standard handlers
                      onChange={onSearchChange} 
                      onFocus={() => {
                        if (searchResults.length > 0) setIsDropdownOpen(true);
                      }}
                      placeholder={searchPlaceholder}
                      className="dark:bg-dark-900 h-14 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                    />

                    <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                      <span> ⌘ </span>
                      <span> K </span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <ul className="max-h-60 overflow-y-auto py-1">
                    {searchResults.map((item) => (
                      <li
                        key={item.id}
                        onMouseDown={(e) => {
                            // Prevent input blur before click registers
                            e.preventDefault(); 
                            handleSelectItem(item);
                        }}
                        className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {buttonText && (
            <Button
              onClick={onButtonClick}
              startIcon={buttonStartIcon}
              className="hidden lg:inline-flex"
            >
              <span className="hidden lg:inline">{buttonText}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default Card;