import { useDispatch, useSelector } from "react-redux";
import TableOutlet from "../../components/common/TableOutlet";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../../components/ui/table";
import { useGetFindingsByProjectIDQuery } from "../../service/project";
import { RootState } from "../../app/store";
import { useParams } from "react-router";
import { TrashBinIcon } from "../../icons";
import { setCurrentPage, setRowsPerPage } from "../../features/project";

const FindingTable = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { rowperpage, currentpage, url_mapping } = useSelector(
    (state: RootState) => state.project
  );
  const { data: findings, isLoading } = useGetFindingsByProjectIDQuery({
    project_id: url_mapping?.id || Number(id),
    page: currentpage,
    pageSize: rowperpage,
  });

  const totalRows = findings?.count || 0;
  const IndexofFirstItem = (currentpage - 1) * rowperpage + 1;
  const IndexofLastItem = Math.min(currentpage * rowperpage, totalRows);
  return (
    <TableOutlet
      title={``}
      pageSizeOptions={[10, 20, 25, 30]}
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
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Vulnerability Name
            </TableCell>
            
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Action
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {findings?.results && findings.results.length > 0 ? (
            findings.results.map((finding) => (
              <TableRow
                key={finding.id}
                className={`cursor-pointer 
                          hover:bg-gray-100 dark:bg-yellow-900/30
                           text-sm  dark:hover:bg-white/[0.03] transition-colors`}
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-600 text-theme-sm dark:text-white/90">
                    {finding.vulnerability?.name}
                  </span>
                  {/* <span className="block font-medium text-gray-600 text-theme-sm dark:text-white/90">
                    // {finding.}
                  </span> */}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex gap-3">
                    <TrashBinIcon className="size-5 cursor-pointer text-red-500 hover:text-red-800" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="px-5 py-4 text-center select-none text-gray-500">
                No findings are added yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableOutlet>
  );
};

export default FindingTable;
