import React from "react";
import { useDispatch, useSelector } from "react-redux";
// Removed unused Headless UI and Icon imports

const pageRowDefault = [10, 20, 30, 50];

interface RowPerPageProps {
  pageRow?: number[];
  rowPerPage?: number | null; // Can be number or null
  
  // This expects a Redux Action Creator (returns an object with type/payload)
  setRowsPerPage: (value: number) => { type: string; payload?: any }; 
  
  // Optional selector function
  useSelectorFn?: (state: any) => any;
  
  className?: string;
}

const RowPerPage: React.FC<RowPerPageProps> = ({
  pageRow = pageRowDefault,
  rowPerPage,
  setRowsPerPage,
  useSelectorFn,
  className = "",
}) => {
  const dispatch = useDispatch();

  // Safe way to handle optional selector without breaking "Rules of Hooks"
  // (Hooks cannot be called conditionally inside a ternary operator like in the original JS)
  const reduxRowPerPage = useSelector((state: any) => 
    useSelectorFn ? useSelectorFn(state) : null
  );

  // Determine which value to use: Prop > Redux > Default (10)
  const currentRowPerPage = rowPerPage ?? reduxRowPerPage ?? 10;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setRowsPerPage(Number(e.target.value)));
  };

  return (
    <div className={`flex flex-1 justify-between p-5 ${className}`}>
      <div className="text-gray-500 text-start text-theme-lg dark:text-gray-400">
        Show
        <div className="relative inline-flex">
          <select
            value={currentRowPerPage} // Control the value here
            onChange={handleChange}
            className="appearance-none rounded-xl bg-none border mx-2 border-gray-200 bg-transparent py-2 px-4 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-600 dark:text-gray-400 dark:bg-gray-900"
          >
            {pageRow.map((entries, index) => (
              <option
                key={index}
                value={entries}
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
              >
                {entries}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none bg-none right-3 dark:text-gray-400">
            <svg
              className="stroke-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        entries
      </div>
    </div>
  );
};

export default RowPerPage;