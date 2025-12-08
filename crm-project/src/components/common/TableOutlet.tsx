import React from "react";
import Pagination from "../pagination/Pagination";
import RowPerPage from "../pagination/Rowperpage";

const DEFAULT_PAGE_SIZES = [10, 20, 30, 50];

interface TableOutletProps {
  // Content
  title?: string | React.ReactNode;
  desc?: string;
  children: React.ReactNode;
  
  // Styling
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  rowPerClassName?: string;

  // Options
  pageSizeOptions?: number[];

  // Pagination Data
  rowsPerPage?: number | null;
  // Matches Redux action creator or state setter
  setRowsPerPage?: ((value: number) => any) | null; 
  totalRows?: number;
  currentPage?: number;
  
  // Handlers
  onPageChange?: ((page: number) => void) | null;

  // Range Display (e.g., "Showing 1-10 of 50")
  indexOfFirstItem?: number | null;
  indexOfLastItem?: number | null;
}

const TableOutlet: React.FC<TableOutletProps> = ({
  title="",
  desc = "",
  children,
  className = "",
  pageSizeOptions = DEFAULT_PAGE_SIZES,

  // Pagination & rows
  rowsPerPage = null,
  setRowsPerPage = null,
  totalRows = 0,
  currentPage = 1,
  onPageChange = null,

  // Range display
  indexOfFirstItem = null,
  indexOfLastItem = null,

  // Style overrides
  headerClassName = "",
  footerClassName = "",
  rowPerClassName = "",
}) => {
  // Logic to determine visibility
  const showPagination =
    onPageChange !== null && 
    rowsPerPage !== null && 
    totalRows > rowsPerPage;

  // !! converts the function to a boolean (true if function exists)
  const showRowSelector = rowsPerPage !== null && !!setRowsPerPage;

  return (
    <div
      className={`h-fit rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      {/* ===== Header ===== */}
      <div
        className={`flex h-16 border-b dark:border-gray-700 flex-row justify-between px-6 py-5 items-center ${headerClassName}`}
      >
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>

        {/* Row per page selector */}
        {showRowSelector && setRowsPerPage && (
          <div className={rowPerClassName}>
            <RowPerPage
              rowPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              pageRow={pageSizeOptions}
            />
          </div>
        )}
      </div>

      {/* ===== Table Body ===== */}
      <div className="flex-1 border-gray-100 dark:border-gray-800 overflow-x-auto">
        {children}
      </div>

      {/* ===== Footer ===== */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 p-5 border-t border-gray-100 dark:border-white/[0.05] ${footerClassName}`}
      >
        {/* Range Info */}
        {indexOfFirstItem !== null && indexOfLastItem !== null && (
          <div className="text-gray-500 text-sm dark:text-gray-400">
            Showing
            <span className="font-semibold ml-1">
              {indexOfFirstItem} - {indexOfLastItem}
            </span>{" "}
            of
            <span className="font-semibold text-slate-600 ml-1">
              {totalRows}
            </span>{" "}
            entries
          </div>
        )}

        {/* Pagination */}
        {showPagination && onPageChange && rowsPerPage && (
          <div className="flex justify-end px-6 py-2">
            <Pagination
              rowsPerPage={rowsPerPage}
              totalRows={totalRows}
              paginate={onPageChange}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TableOutlet;