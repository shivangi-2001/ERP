import React, { useState } from "react";
import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Card from "../../../components/common/Card";
import { PlusIcon } from "../../../icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import PageMeta from "../../../components/common/PageMeta";
import Badge from "../../../components/ui/badge/Badge";
import SelectAssessmentType from "./SelectAssessmentType";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../../components/ui/modal";
import {
  setClientDetail,
  setCurrentPage,
  setRowsPerPage,
} from "../../../features/project";
import TableOutlet from "../../../components/common/TableOutlet";

const TableTitle = ["Client Name", "", "Action"];

const ManageIndex: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, toggleModal, closeModal } = useModal();
  const [clientID, setClientID] = useState<number>(0);
  const { clientdetails, rowperpage, currentpage } = useSelector(
    (state: RootState) => state.project
  );

  const totalRows = clientdetails?.count || 0;
  const IndexofFirstItem = (currentpage - 1) * rowperpage + 1;
  const IndexofLastItem = Math.min(currentpage * rowperpage, totalRows);
  return (
    <div className="flex flex-col flex-1 gap-3">
      <PageMeta
        title="Manage Clients"
        description="All clients details associated with our company."
      />
      <Card
        title="Client Details"
        desc="Manage clients evalution"
        enableSearch={true}
        searchPlaceholder="Search Clients e.g: zoho, ..."
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
              {clientdetails?.results.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <Link to={`/clients/${client.id}`}>
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
                    <button
                      onClick={() => {
                        dispatch(setClientDetail(client));
                        toggleModal();
                        setClientID(client?.id || 0);
                      }}
                    >
                      <Badge
                        variant="solid"
                        color="info"
                        startIcon={<PlusIcon />}
                      >
                        Evulation
                      </Badge>
                    </button>
                  </TableCell>
                </TableRow>
              ))}

              {clientdetails?.count == 0 && (
                <TableCell className="text-center p-5 text-gray-500 select-none">
                  No Clients added yet
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableOutlet>
      </Card>

      <Modal  isOpen={isOpen} onClose={closeModal}>
        <SelectAssessmentType ClientID={clientID} />
      </Modal>
    </div>
  );
};

export default ManageIndex;
