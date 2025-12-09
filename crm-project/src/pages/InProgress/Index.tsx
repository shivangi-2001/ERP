import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import Card from "../../components/common/Card";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../../components/ui/table/index";
import TableOutlet from "../../components/common/TableOutlet";
import { RootState } from "../../app/store";
import { setRowsPerPage, setCurrentPage, setUrlMapping } from "../../features/project";
import { useGetInProgressProjectQuery } from "../../service/project";
import { formatDate } from "../../utils/date";
import { CheckLineIcon, CopyIcon, DownloadIcon, PlusIcon } from "../../icons";

let TableTitle = [
  "Client Name",
  "Start Date",
  "End Date",
  "QA Date",
  "Compliance",
  "Action",
];
const InProgressIndex = () => {
  const dispatch = useDispatch();
  const { rowperpage, currentpage } = useSelector(
    (state: RootState) => state.project
  );

  const { data } = useGetInProgressProjectQuery();

  const totalRows = data?.count || 0;
  const IndexofFirstItem = (currentpage - 1) * rowperpage + 1;
  const IndexofLastItem = Math.min(currentpage * rowperpage, totalRows);


  return (
    <Card
      title="In Progress Projects"
      desc="Currenlty on-going projects"
      searchInput={true}
      searchPlaceholder="Search by Client Name"
    >
      <TableOutlet
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
              {TableTitle.map((title, index) => (
                <TableCell
                  isHeader
                  key={index}
                  className="px-5 py-3 capitalize font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data?.results.map((item) => (
              <TableRow key={item.id} className="text-theme-sm">
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <Link to={`/client/${item.client_assessment?.client}?assessment_type=${item.client_assessment?.assessment_type_name}`} className="">
                    <span className="block font-medium text-blue-700  truncate dark:text-white/90 w-45">
                        {item.url}
                    </span>
                    <span className="block font-medium text-amber-600 dark:text-white/90 hover:underline hover:underline-offset-1 hover:scale-102">
                        {item.client_assessment?.client_name}
                    </span>
                    </Link>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                <span className="block font-medium dark:text-white/90">{formatDate(item.start_date)}</span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                <span className="block font-medium dark:text-white/90">{formatDate(item.end_date)}</span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                <span className="block font-medium dark:text-white/90">{formatDate(item.qa_date)}</span>
                </TableCell>
                <TableCell className="font-medium px-5 py-4 sm:px-6 text-start">
                <span className="block font-medium dark:text-white/90">{item.compliance?.name}</span>
                  
                  <span className="block font-medium text-emerald-500 dark:text-white/90">
                        ( {item.client_assessment?.assessment_type_name} )
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 grid grid-cols-2 gap-4">
                    <Link to={`/in-progress/${item.id}`} onClick={() => dispatch(setUrlMapping(item))}>
                    <button title="Add Vulnerability">
                        <PlusIcon className="size-6 text-purple-600 hover:text-purple-300"/>
                    </button>
                    </Link>
                    <button title="Download Report">
                        <DownloadIcon className="size-6 text-rose-600 hover:text-rose-300"/>
                    </button>
                    <button title="Mark completed on going project">
                        <CheckLineIcon className={`size-6 ${item.is_completed? "text-emerald-600":"text-emerald-100"}  hover:text-emerald-300`}/>
                    </button>
                    <button title="Add Notes">
                        <CopyIcon className="size-6 text-sky-600 hover:text-sky-300"/>
                    </button>
                </TableCell>
              </TableRow>
            ))}

            {data?.count == 0 && (
              <TableCell className="text-center p-5 text-gray-500 select-none">
                No project started yet
              </TableCell>
            )}
          </TableBody>
        </Table>
      </TableOutlet>
    </Card>
  );
};

export default InProgressIndex;
