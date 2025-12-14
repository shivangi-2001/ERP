import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import { Table, TableHeader, TableBody, TableCell, TableRow, } from "../../components/ui/table";
import TableOutlet from "../../components/common/TableOutlet";
import Alert from "../../components/ui/alert/Alert";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import { CheckCircleIcon, CloseIcon, PencilIcon, PlusIcon, TrashBinIcon, } from "../../icons";
import { RootState } from "../../app/store";
import { Assessment } from "../../types/assessment";
import { setAssessmentTypes, setRowsPerPage, setCurrentPage, } from "../../features/assessment";
import { useGetAssessmentsQuery, useUpdateAssessmentByIdMutation, useAddAssessmentMutation, useDeleteAssessmentByIdMutation, } from "../../service/assessment";

const AssessmentType: React.FC = () => {
  const dispatch = useDispatch();
  const { rowperpage, currentpage } = useSelector(
    (state: RootState) => state.assessment
  );
  const { data, isLoading, isError, refetch } = useGetAssessmentsQuery(
    { page: currentpage, pageSize: rowperpage },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (data?.results && Array.isArray(data.results)) {
      const options = data.results.map((item: Assessment) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      dispatch(setAssessmentTypes(options));
    }
  }, [data, dispatch]);

  const totalRows = data?.count || 0;
  const IndexofFirstItem = (currentpage - 1) * rowperpage + 1;
  const IndexofLastItem = Math.min(currentpage * rowperpage, totalRows);

  const [updateAssessment] = useUpdateAssessmentByIdMutation();
  const [addAssessment] = useAddAssessmentMutation();
  const [deleteAssessment] = useDeleteAssessmentByIdMutation();

  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  if (isLoading) {
    return <ComponentCard title="Type of Assessment">Loading...</ComponentCard>;
  }

  if (isError) {
    return (
      <ComponentCard title="Type of Assessment">
        Error loading data
      </ComponentCard>
    );
  }

  const handleEditClick = (item: Assessment) => {
    setEditId(item.id);
    setEditValue(item.name);
  };

  const handleEdit = async (id: number) => {
    try {
      await updateAssessment({ id, data: { name: editValue } }).unwrap();
      setEditId(null);
      setStatusMessage({
        type: "success",
        text: "Updated successfully!",
      });
    } catch (error: any) {
      const errorMsg = error.data?.detail || "Failed to update assesment.";
      setStatusMessage({ type: "error", text: errorMsg });
    }
  };

  const handleAddAssessment = async () => {
    const name = prompt("Enter new assessment:");
    if (!name) return;

    try {
      await addAssessment({ name }).unwrap();
      refetch();
      setStatusMessage({
        type: "success",
        text: "Added successfully!",
      });
    } catch (error: any) {
      if (error?.data) {
        const detailMsg = error.data.detail || "Failed to add vulnerability. Please check inputs.";
        setStatusMessage({ type: "error", text: detailMsg });
      } else {
        setStatusMessage({
          type: "error",
          text: "Something went wrong. Please try again.",
        });
      }
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assessment?"
    );
    if (!confirmDelete) return;

    try {
      await deleteAssessment(id).unwrap();
      refetch();
      setStatusMessage({
        type: "warning",
        text: "Deleted !",
      });
    } catch (error: any) {
      const errorMsg = error.data?.detail || "Failed to delete assesment.";
      setStatusMessage({ type: "error", text: errorMsg });
    }
  };

  return (
    <ComponentCard
      title="Type of Assessment"
      button={
        <Button onClick={handleAddAssessment}>
          <PlusIcon />
        </Button>
      }
    >
      {statusMessage && (
        <div className="px-5 py-2">
          <Alert
            variant={statusMessage.type}
            title=""
            message={statusMessage.text}
          />
        </div>
      )}

      <TableOutlet
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
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Assessment Name
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
            {data?.results && data.results.length > 0 ? (
              data.results.map((item: Assessment) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {editId === item.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleEdit(item.id);
                        }}
                        className="inline-flex items-center gap-2"
                      >
                        <Input
                          name="name"
                          value={editValue}
                          className=" capitalize "
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                        <button type="submit">
                          <CheckCircleIcon className="size-5 text-green-500 hover:text-green-600" />
                        </button>
                        <button
                          onClick={() => {
                            setEditId(null);
                            setEditValue("");
                          }}
                        >
                          <CloseIcon className="size-5 text-red-500 hover:text-red-700" />
                        </button>
                      </form>
                    ) : (
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {item.name}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-3">
                      <PencilIcon
                        className="size-5 cursor-pointer text-blue-500 hover:text-blue-800"
                        onClick={() => handleEditClick(item)}
                      />
                      <TrashBinIcon
                        className="size-5 cursor-pointer text-red-500 hover:text-red-800"
                        onClick={() => handleDelete(item.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="px-5 py-4 text-center text-gray-500">
                  No assessments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableOutlet>
    </ComponentCard>
  );
};

export default AssessmentType;
