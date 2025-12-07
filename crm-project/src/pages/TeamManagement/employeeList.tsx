import { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { useDeleteEmployeeByIdMutation, useGetEmployeeQuery } from "../../service/myTeam";
import { Employee } from "../../types/myTeam";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedEmployee, setRowsPerPage, setCurrentPage } from "../../features/myTeam";
import { RootState } from "../../app/store";
import TableOutlet from "../../components/common/TableOutlet";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { selected_employee, rowperpage, currentpage } = useSelector((state: RootState) => state.myTeam);

  // FIX 1: You had these swapped! 
  // page maps to currentpage, pageSize maps to rowperpage.
  const { data } = useGetEmployeeQuery(
    { page: currentpage, pageSize: rowperpage }, 
    { refetchOnMountOrArgChange: true }
  );

  const totalRows = data?.count || 0;
  const IndexofFirstItem = (currentpage - 1) * rowperpage + 1;
  const IndexofLastItem = Math.min(currentpage * rowperpage, totalRows);

  const [deleteEmployee] = useDeleteEmployeeByIdMutation();

  useEffect(() => {
    if(data?.results && data.results.length > 0) {
      // Optional: Only set if no employee is currently selected
      if (!selected_employee) {
        dispatch(setSelectedEmployee(data.results[0]));
      }
    }
  }, [data?.results, dispatch]);

  const handleDelete = async(e: React.MouseEvent, id: number) => {
    // FIX 2: Stop Propagation
    // Prevents the row's onClick (setSelectedEmployee) from firing when clicking delete
    e.stopPropagation(); 

    const confirmDelete = window.confirm("Are you sure you want to delete this employee permanently?");
    if (!confirmDelete) return;

    try {
      await deleteEmployee(id).unwrap();
      // No need for alert usually if UI updates automatically, but keeping it per your code
      alert("Employee deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete employee.");
    }
  }

  return (
    <TableOutlet 
          title="Employee List" 
          desc="List of all employees working in your company"
          pageSizeOptions={[7, 10, 15, 20]}
          rowsPerPage={rowperpage}
          setRowsPerPage={(rows) => dispatch(setRowsPerPage(rows))}
          totalRows={totalRows}
          currentPage={currentpage}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
          indexOfFirstItem={IndexofFirstItem}
          indexOfLastItem={IndexofLastItem}
    >
      <Table>
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Full Name
            </TableCell>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Email
            </TableCell>
            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Action
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05]`}>
          {data?.results && data.results.length > 0 ? (
            data.results.map((item: Employee) => (
              <TableRow 
                key={item.id} 
                className={`${selected_employee?.id === item.id ? "bg-blue-100 dark:bg-yellow-900/35" : "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.03]"}`} 
                onClick={() => dispatch(setSelectedEmployee(item))}
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {item.first_name} {item.last_name}
                  </span>
                </TableCell>

                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-light text-gray-800 text-theme-sm dark:text-white/90">
                    {item.email}
                  </span>
                </TableCell>

                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="inline-flex gap-3">
                    {/* Add onClick propagation stop here if needed, usually cleaner on the container or handler */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            // Add edit logic here
                        }}
                    >
                        <PencilIcon className="size-5 text-blue-500 hover:text-blue-700" />
                    </button>
                    
                    <button onClick={(e) => handleDelete(e, item.id)}>
                        <TrashBinIcon className="size-5 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
                No employees added yet
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableOutlet>
  );
};

export default EmployeeList;