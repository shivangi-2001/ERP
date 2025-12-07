import React from 'react';

interface PaginationProps {
  rowsPerPage: number;
  totalRows: number;
  paginate: (pageNumber: number) => void; 
  currentPage: number; 
}

const Pagination: React.FC<PaginationProps> = ({ 
  rowsPerPage, 
  totalRows, 
  paginate, 
  currentPage 
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const maxPageNumbersToShow = 3;

  // If there are no pages, don't render the component
  if (totalPages === 0) return null;

  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Logic to determine the sliding window of page numbers
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

  // Styles
  const baseStyle = "flex items-center justify-center px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg transition-colors";
  
  // Note: specific background colors might conflict (bg-black vs bg-brand-50), ensure your Tailwind config supports 'brand' colors
  const activeStyle = "flex items-center justify-center px-3 py-2 leading-tight text-brand-600 bg-brand-50 border border-brand-300 hover:bg-brand-100 dark:border-brand-500 dark:bg-brand-600 dark:text-white rounded-lg transition-colors";

  const disabledStyle = "px-1.5 py-0.5 ml-0 leading-tight border border-gray-300 rounded-full text-gray-300 cursor-not-allowed dark:border-gray-700 dark:text-gray-600";

  return (
    <nav className="flex justify-center items-center gap-1.5 text-sm my-4">
      {/* Previous Button */}
      <button
        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={currentPage === 1 
          ? disabledStyle 
          : "px-1.5 py-0.5 ml-0 leading-tight border border-gray-300 rounded-full hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
        }
      >
        &laquo;
      </button>

      <ul className="inline-flex -space-x-px gap-1.5">
        {totalPages <= maxPageNumbersToShow ? (
          // Show all pages if total is small
          pageNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={number === currentPage ? activeStyle : baseStyle}
              >
                {number}
              </button>
            </li>
          ))
        ) : (
          // Show truncated view (1 ... 4 5 6 ... 10)
          <>
            {startPage > 1 && (
              <li>
                <button onClick={() => paginate(1)} className={baseStyle}>
                  1
                </button>
              </li>
            )}
            
            {startPage > 2 && (
              <li>
                <span className="flex items-center justify-center px-3 py-2 leading-tight text-gray-500 bg-transparent dark:text-gray-400">
                  ...
                </span>
              </li>
            )}

            {pageNumbers.slice(startPage - 1, endPage).map((number) => (
              <li key={number}>
                <button
                  onClick={() => paginate(number)}
                  className={number === currentPage ? activeStyle : baseStyle}
                >
                  {number}
                </button>
              </li>
            ))}

            {endPage < totalPages - 1 && (
              <li>
                <span className="flex items-center justify-center px-3 py-2 leading-tight text-gray-500 bg-transparent dark:text-gray-400">
                  ...
                </span>
              </li>
            )}

            {endPage < totalPages && (
              <li>
                <button onClick={() => paginate(totalPages)} className={baseStyle}>
                  {totalPages}
                </button>
              </li>
            )}
          </>
        )}
      </ul>

      {/* Next Button */}
      <button
        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={currentPage === totalPages 
          ? disabledStyle 
          : "px-1.5 py-0.5 ml-0 leading-tight border border-gray-300 rounded-full hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
        }
      >
        &raquo;
      </button>
    </nav>
  );
};

export default Pagination;