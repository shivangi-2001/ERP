import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
} from "../../../components/ui/table";
import { Vulnerability } from "../../../types/assessment";
import {
  CheckCircleIcon,
  CloseIcon,
  PencilIcon,
  TrashBinIcon,
} from "../../../icons";
import {
  useGetVulnerabilitiesQuery,
  useDeleteVulnerabilityByIdMutation,
  useUpdateVulnerabilityByIdMutation,
} from "../../../service/assessment";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import TableOutlet from "../../../components/common/TableOutlet";
import { setRowsPerPage, setCurrentPage } from "../../../features/assessment";

const VulnerabilityList: React.FC = () => {
  const dispatch = useDispatch();
  const { rowperpage, currentpage } = useSelector(
    (state: RootState) => state.assessment
  );

  const { data: vulnerabilities } = useGetVulnerabilitiesQuery(
    { page: currentpage, pageSize: rowperpage },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const totalRows = vulnerabilities?.count || 0;
  const IndexofFirstItem = (currentpage - 1) * rowperpage + 1;
  const IndexofLastItem = Math.min(currentpage * rowperpage, totalRows);

  const [deleteVulnerability] = useDeleteVulnerabilityByIdMutation();
  const [updateVulnerability] = useUpdateVulnerabilityByIdMutation();

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const { assessment_types } = useSelector(
    (state: RootState) => state.assessment
  );

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vulnerability?"
    );
    if (!confirmDelete) return;
    try {
      await deleteVulnerability(id).unwrap();
      alert("Deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete vulnerability");
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditCategory("");
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateVulnerability({ id, data: { name: editName, category_of_testing_id: Number(editCategory), }, }).unwrap();
      alert(`Successfully updated the vulnerability "${editName}"`);
      setEditId(null);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update vulnerability.");
    }
  };

  return (
    <TableOutlet
      title="Vulnerability List"
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
              Category of Testing
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
          {vulnerabilities?.results && vulnerabilities.results.length > 0 ? (
            vulnerabilities.results.map((item: Vulnerability) =>
              editId === item.id ? (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <Input
                      name="name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter vulnerability name"
                    />
                  </TableCell>

                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <Select
                      options={assessment_types}
                      placeholder="Select category"
                      onChange={(val) => setEditCategory(val)}
                      defaultValue={editCategory}
                    />
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex gap-3">
                      <CheckCircleIcon
                        className="size-5 text-green-500 hover:text-green-600 cursor-pointer"
                        onClick={() => handleUpdate(item.id)}
                      />
                      <CloseIcon
                        className="size-5 text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={handleCancelEdit}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {item.name}
                    </span>
                  </TableCell>

                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {item.category_of_testing?.name || "—"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-3">
                      <PencilIcon
                        className="size-5 cursor-pointer text-blue-500 hover:text-blue-800"
                        onClick={() => {
                          setEditId(item.id);
                          setEditName(item.name);
                          setEditCategory(
                            item.category_of_testing?.id?.toString() || ""
                          );
                        }}
                      />
                      <TrashBinIcon
                        className="size-5 cursor-pointer text-red-500 hover:text-red-800"
                        onClick={() => handleDelete(item.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            )
          ) : (
            <TableRow>
              <TableCell className="px-5 py-4 text-center text-gray-500">
                No Vulnerabilities have been added
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableOutlet>
  );
};

export default VulnerabilityList;
