import React, { useEffect, useState } from "react";

interface CountryCode {
  code: string;  // e.g., "+91" or "IN" depending on your data
  label: string; // e.g., "India"
}

interface PhoneInputProps {
  countries: CountryCode[];
  placeholder?: string;
  defaultCountry?: string; // e.g. "IN"
  defaultCode?: string;    // e.g. "+91"
  defaultNumber?: string;  // e.g. "9876543210"
  onChange?: (data: { code: string; number: string }) => void;
  selectPosition?: "start" | "end";
  disabled?: boolean;
  success?: boolean;
  error?: string | boolean | undefined;
  hint?: string;
  required?: boolean;
  className?: string; // Added this to interface
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  countries,
  placeholder = "+91 (555) 000-0000",
  defaultCountry = "IN",
  defaultCode = "",
  defaultNumber = "",
  onChange,
  selectPosition = "start",
  disabled = false,
  success = false,
  error = false,
  hint,
  required = false,
  className = "", // Default value for className
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(defaultCountry);
  const [phoneCode, setPhoneCode] = useState<string>(defaultCode);
  const [phoneNumber, setPhoneNumber] = useState<string>(defaultNumber);

  // FIX 1: Sync state when props change (e.g., when API data loads)
  useEffect(() => {
    if (defaultCode) setPhoneCode(defaultCode);
    if (defaultNumber) setPhoneNumber(defaultNumber);
    
    // Optional: Logic to sync selectedCountry dropdown based on defaultCode
    // This depends on whether your 'countries' prop uses ISO codes or Phone codes as the key
    const foundCountry = countries.find(c => c.code === defaultCode || c.label === defaultCode);
    if(foundCountry) {
        // This is a guess based on your data structure, adjust if needed
        setSelectedCountry(foundCountry.code); 
    }
  }, [defaultCode, defaultNumber, countries]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setSelectedCountry(newCode);
    setPhoneCode(newCode);

    // FIX 2: Call onChange immediately, don't wait for useEffect
    if (onChange) {
      onChange({ code: newCode, number: phoneNumber });
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value;
    setPhoneNumber(newNumber);

    // FIX 2: Call onChange immediately
    if (onChange) {
      onChange({ code: phoneCode, number: newNumber });
    }
  };

  // FIX 3: Construct the class string safely
  let wrapperClasses = `relative flex ${className}`;
  
  let inputBaseClasses = `dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent py-3 px-4 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30`;
  
  // Dynamic padding based on select position
  if (selectPosition === "start") {
    inputBaseClasses += " pl-[90px]";
  } else {
    inputBaseClasses += " pr-[84px]";
  }

  // State based styling
  if (disabled) {
    inputBaseClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputBaseClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputBaseClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputBaseClasses += ` text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800`;
  }

  return (
    <div className={wrapperClasses}>
      {selectPosition === "start" && (
        <div className="absolute z-10">
          <select
            disabled={disabled}
            value={phoneCode} // Controlled by phoneCode usually makes more sense for the API
            onChange={handleCountryChange}
            required={required}
            className="appearance-none w-20 bg-none rounded-l-lg border-0 border-r border-gray-200 bg-transparent py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400"
          >
            {countries.map((country) => (
              // Assuming country.code is the phone code like "+91"
              <option
                key={country.code}
                value={country.code} 
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
              >
                {country.code}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 flex items-center right-3 text-gray-700 pointer-events-none dark:text-gray-400">
            ▼
          </div>
        </div>
      )}

      {/* FIX 4: Use the calculated inputBaseClasses here */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputBaseClasses}
      />

      {hint && (
        <p
          className={`absolute -bottom-6 left-0 text-xs ${
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

export default PhoneInput;