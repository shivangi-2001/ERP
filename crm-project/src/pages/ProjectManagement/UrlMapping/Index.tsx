import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams, Link } from "react-router";

// Components
import ComponentCard from "../../../components/common/ComponentCard";
import TableOutlet from "../../../components/common/TableOutlet";
import { Table, TableCell, TableBody, TableHeader, TableRow } from "../../../components/ui/table";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import Badge from "../../../components/ui/badge/Badge";
import TextArea from "../../../components/form/input/TextArea";

// Icons
import { PencilIcon, FileIcon, TableIcon, CheckCircleIcon, CloseIcon, ChevronDownIcon, GroupIcon, PlugInIcon } from "../../../icons";

// Redux & Services
import { RootState } from "../../../app/store";
import { setRowsPerPage, setCurrentPage, setUrlMappingList, setUrlMapping } from "../../../features/project";
import { useGetUrlMappingQuery, useEditUrlMappingByIDMutation, useGetClientAssessmentTypeQuery } from "../../../service/project"; // Assuming you have an edit mutation
import { useModal } from "../../../hooks/useModal";

// Sub-components
import UrlMappingForm from "./URL/Form";
import ViewDetail from "./ViewDetail";
import SendToAssessment from "./SendToAssessment";
import { setClientAssessmentTypeId } from "../../../features/project";

const TableTitle = ["URL", "Action"];

const UrlMappingIndex = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  // Redux State
  const { clientdetail, client_assesment_id: client_assesment_type, rowperpage, currentpage } =
    useSelector((state: RootState) => state.project);

  // --- Modal & Dropdown State ---
  const { isOpen: isAddOpen, openModal: openAddModal, closeModal: closeAddModal } = useModal();
  const [dropOpen, setDropOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // --- Row Action State ---
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openAssessModal, setOpenAssessModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // --- Inline Edit State ---
  const [editId, setEditId] = useState<number | null>(null);
  const [editUrlValue, setEditUrlValue] = useState<string>("");
  
  // API Mutations
  const [updateUrlMapping] = useEditUrlMappingByIDMutation(); 

  const query_assessment_type = searchParams.get("assessment_type");

  // Fetch Data for URL
  const { data: urlMappingList, isLoading } = useGetUrlMappingQuery(
    {
      client_id: Number(id) || clientdetail?.id || 0,
      assessment_type: client_assesment_type?.assessment_type_name || query_assessment_type,
      page: currentpage,
      pageSize: rowperpage,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !id && !clientdetail?.id,
    }
  );

  useEffect(() => {
    if (urlMappingList?.count) {
      dispatch(setUrlMappingList(urlMappingList));
      dispatch(setUrlMapping(urlMappingList?.results[0]));
    }
  }, [dispatch, urlMappingList]);

  const {data: client_assessment} = useGetClientAssessmentTypeQuery({
    client_id: Number(id) || clientdetail?.id || 0,
    assessment_type: query_assessment_type,
    page: currentpage,
    pageSize: rowperpage,
  },
  {
    refetchOnMountOrArgChange: true,
    skip: !id && !clientdetail?.id,
  })

  // Sync Data to Redux
  useEffect(() => {
    if (client_assessment?.count) {
      dispatch(setClientAssessmentTypeId(client_assessment?.results[0]));
    }
  }, [dispatch, client_assessment]);

  // Click Outside Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalRows = urlMappingList?.count || 0;
  const IndexofFirstItem = (currentpage - 1) * rowperpage + 1;
  const IndexofLastItem = Math.min(currentpage * rowperpage, totalRows);

  // --- Handlers ---

  const handleAddUrlClick = () => {
    setDropOpen(false);
    openAddModal();
  };

  // Open View Details Modal
  const handleViewDetails = (urlId: number) => {
    setSelectedId(urlId);
    setOpenViewModal(true);
  };

  // Open Send To Assessment Modal
  const handleSendToAssessment = (urlId: number) => {
    setSelectedId(urlId);
    setOpenAssessModal(true);
  };

  // Start Inline Edit
  const handleEditClick = (urlObj: any) => {
    setEditId(urlObj.id);
    setEditUrlValue(urlObj.url);
  };

  // Cancel Inline Edit
  const handleCancelEdit = () => {
    setEditId(null);
    setEditUrlValue("");
  };

  const handleUpdate = async (id: number) => {
    try {
        await updateUrlMapping({ id, body: { url: editUrlValue } }).unwrap();
        setEditId(null);
    } catch (error) {
        console.error("Failed to update URL", error);
    }
  };

  if (isLoading)
    return <div className="p-6 text-center text-gray-500">Loading URLs...</div>;

  return (
    <ComponentCard
      title={`URLs: ${query_assessment_type || "All Assessments"}`}
      desc={clientdetail?.name||client_assesment_type?.client_name}
      button={
        <div className="relative inline-block" ref={dropdownRef}>
          <Button variant="primary" onClick={() => setDropOpen(!dropOpen)}>
            Add <ChevronDownIcon className="size-5" />
          </Button>

          <Dropdown
            isOpen={dropOpen}
            onClose={() => setDropOpen(false)}
            className="absolute right-0 mt-2 w-[240px] flex-col rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark z-50"
          >
            <ul className="flex flex-col gap-1">
              <li>
                <DropdownItem
                  onItemClick={handleAddUrlClick}
                  className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 cursor-pointer"
                >
                  <FileIcon className="size-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400" />
                  Add URL
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  onItemClick={() => setDropOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 cursor-pointer"
                >
                  <TableIcon className="size-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400" />
                  Import Excel Sheet
                </DropdownItem>
              </li>
            </ul>
          </Dropdown>
        </div>
      }
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
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {urlMappingList?.results && urlMappingList.results.length > 0 ? (
              urlMappingList.results.map((url: any) =>
                editId === url.id ? (
                  <TableRow
                    key={url.id}
                    className=" hover:bg-gray-100 dark:bg-yellow-900/30 text-sm transition-colors"
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <TextArea
                        id="url_edit"
                        name="url"
                        value={editUrlValue}
                        onChange={(val) => setEditUrlValue(val)} 
                        placeholder="Enter URL"
                      />
                    </TableCell>

                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex gap-3">
                        <CheckCircleIcon
                          className="size-6 text-green-500 hover:text-green-600 cursor-pointer"
                          onClick={() => handleUpdate(url.id)}
                        />
                        <CloseIcon
                          className="size-6 text-red-500 hover:text-red-700 cursor-pointer"
                          onClick={handleCancelEdit}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={url.id} className="hover:bg-gray-10 dark:hover:bg-yellow-900/300">
                    <TableCell className="px-5 py-4 sm:px-6  text-start max-w-lg truncate">
                      <a
                        href={url.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {url.url}
                      </a>
                    </TableCell>

                    {/* 2. Actions */}
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <div className="flex flex-wrap gap-2 w-fit">
                        {/* View Details */}
                        <div>
                        <Button
                          size="xs"
                          variant="info"
                          startIcon={<FileIcon className="size-4" />}
                          onClick={() => handleViewDetails(url.id)}
                        >
                          Details
                        </Button>
                        </div>

                        {/* SPOC Link */}
                        <Link to={`/clients/${id}`}>
                        <Badge
                          color="error"
                          variant="light"
                          startIcon={<GroupIcon className="size-4" />}
                        >
                          SPOC
                        </Badge>
                        </Link>

                        {/* Send To Assessment */}
                        <div>
                        <Button
                          size="xs"
                          variant="warning"
                          startIcon={<PlugInIcon className="size-4" />}
                          onClick={() => handleSendToAssessment(url.id)}
                        >
                          Send to Assessment
                        </Button>
                        </div>

                        {/* Edit (Triggers Inline Edit) */}
                        <div>
                        <Badge
                          variant="light"
                          color="info"
                          startIcon={<PencilIcon className="size-4" />}
                          onClick={() => handleEditClick(url)}
                        >
                          Edit
                        </Badge>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              // Empty State
              <TableRow>
                <TableCell 
                    className="text-center p-8 text-gray-500 select-none"
                >
                  No URLs added for this assessment type yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableOutlet>

      <Modal isOpen={isAddOpen} onClose={closeAddModal} className="max-w-5xl w-full">
        <UrlMappingForm />
      </Modal>

      <Modal 
        isOpen={openViewModal} 
        onClose={() => setOpenViewModal(false)} 
        className="max-w-3xl w-full"
      >
        {selectedId && <ViewDetail url_mapping_id={selectedId} />}
      </Modal>

      <Modal 
        isOpen={openAssessModal} 
        onClose={() => setOpenAssessModal(false)} 
        className="max-w-5xl w-full"
      >
        {selectedId && <SendToAssessment url_mapping_id={selectedId} />}
      </Modal>

    </ComponentCard>
  );
};

export default UrlMappingIndex;