import { useState } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../../../components/ui/table/index";
import TableOutlet from "../../../components/common/TableOutlet";
import Badge from "../../../components/ui/badge/Badge";
import { Modal } from "../../../components/ui/modal";
import { PlusIcon } from "../../../icons";
import { useModal } from "../../../hooks/useModal";
import { RootState } from "../../../app/store";
import { setClientDetail, setCurrentPage, setRowsPerPage } from "../../../features/project";
import ClientAssessmentTypeForm from "../ClientAssessment/Form";
import ClientTeamForm from "../ClientTeam/Form";

const TableTitle = ["Company Name", "Company Details", "Teams"];

const ClientTable = () => {
  const dispatch = useDispatch();
  const { clientdetails, rowperpage, currentpage } = useSelector(
    (state: RootState) => state.project
  );
  
  const { toggleModal, isOpen, closeModal } = useModal();
  
  // 2. Add state to track WHICH form to show ('team' or 'assessment')
  const [modalType, setModalType] = useState<'team' | 'assessment' | null>(null);


  const totalRows = clientdetails?.count || 0;
  const IndexofFirstItem = (currentpage - 1) * rowperpage + 1;
  const IndexofLastItem = Math.min(currentpage * rowperpage, totalRows);
  
  // Helper to handle opening specific modals
  const handleOpenModal = (data: any, type: 'team' | 'assessment') => {
    dispatch(setClientDetail(data)); // Set the active client in Redux
    setModalType(type);              // Set the type of modal
    toggleModal();                   // Open the modal
  };

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
          {clientdetails?.results.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="px-5 py-4 sm:px-6 text-start">
                <Link to={`/clients/${client.id}`} onClick={() => dispatch(setClientDetail(client))}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={client.profile || "/images/user/user-01.jpg"}
                        alt={client.name}
                      />
                    </div>
                    <div>
                      <span className="block hover:underline hover:scale-105 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {client.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {client.email}
                      </span>
                    </div>
                  </div>
                </Link>
              </TableCell>

              <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {`${client.address?.address || ""}, ${
                    client.address?.city || ""
                  }, ${client.address?.state || ""} `}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {`${client.phone_code || ""} ${client.phone || ""}`}
                </span>
              </TableCell>

              <TableCell className="flex flex-1 gap-3 px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                <Badge variant="light" color="info">{client.teams?.length || 0}</Badge>{" "}
                
                {/* 3. Update Buttons to use the helper function */}
                <button onClick={() => handleOpenModal(client, 'team')}>
                  <Badge variant="light" color="warning" startIcon={<PlusIcon className="size-4"/>}>Team</Badge>
                </button>

                <button onClick={() => handleOpenModal(client, 'assessment')}>
                  <Badge variant="light" color="primary" startIcon={<PlusIcon className="size-4"/>}>Assessment Type</Badge>
                </button>
              </TableCell>
            </TableRow>
          ))}

          {clientdetails?.count==0 && <TableCell className="text-center p-5 text-gray-500 select-none">
            No Clients added yet
            </TableCell>}
        </TableBody>
      </Table>

      {/* 4. Use ONE Modal component, and switch the content inside */}
      <Modal
        isFullscreen={false}
        isOpen={isOpen}
        onClose={closeModal}
        className="mx-auto"
      >
        {modalType === 'team' && (
          <ClientTeamForm  />
        )}

        {modalType === 'assessment' && (
           <ClientAssessmentTypeForm />
        )}
      </Modal>

    </TableOutlet>
  );
};

export default ClientTable;