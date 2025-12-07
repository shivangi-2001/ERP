import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../../../components/ui/table/index";
import { useModal } from "../../../hooks/useModal";
import TableOutlet from "../../../components/common/TableOutlet";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { useGetClientDetailsQuery } from "../../../service/project";
import { RootState } from "../../../app/store";
import { setClientDetail, setCurrentPage, setRowsPerPage } from "../../../features/project";
import ClientTeamForm from "../ClientTeam/Form";

const TableTitle = ["Company Name", "Company Details", "Teams"];

const ClientTable = () => {
  const dispatch = useDispatch();
  const { rowperpage, currentpage } = useSelector(
    (state: RootState) => state.project
  );
  const { toggleModal, isOpen, closeModal } = useModal();
  const { data, refetch } = useGetClientDetailsQuery({ next: currentpage }, { refetchOnMountOrArgChange: true });

  const totalRows = data?.count || 0;
  const IndexofFirstItem = (currentpage - 1) * rowperpage + 1;
  const IndexofLastItem = Math.min(currentpage * rowperpage, totalRows);
  
  return (
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
          {data?.results.map((data) => (
            <TableRow key={data.id}>
              <TableCell className="px-5 py-4 sm:px-6 text-start">
                <Link to={`/clients/${data.id}`} onClick={() => dispatch(setClientDetail(data))}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={data.profile || "/images/user/user-01.jpg"}
                        alt={data.name}
                      />
                    </div>
                    <div>
                      <span className="block hover:underline hover:scale-105 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {data.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {data.email}
                      </span>
                    </div>
                  </div>
                </Link>
              </TableCell>

              <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {`${data.address?.address || ""}, ${
                    data.address?.city || ""
                  }, ${data.address?.state || ""} `}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {`${data.phone_code || ""} ${data.phone || ""}`}
                </span>
              </TableCell>

              <TableCell className="flex flex-1 gap-3 px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                <Badge>{data.teams?.length || 0}</Badge>{" "}
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    dispatch(setClientDetail(data))
                    toggleModal()
                  }}
                >
                  + Team
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isFullscreen={false}
        isOpen={isOpen}
        onClose={closeModal}
        className="mx-auto"
      >
        <ClientTeamForm />
      </Modal>
    </TableOutlet>
  );
};

export default ClientTable;
