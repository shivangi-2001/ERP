import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import {
  PencilIcon,
  TrashBinIcon,
  CheckCircleIcon,
  CloseIcon,
  PlusIcon,
} from "../../icons";
import {
  useAddTeamMutation,
  useDeleteTeamByIdMutation,
  useGetTeamsQuery,
  useUpdateTeamByIdMutation,
} from "../../service/myTeam";
import { Team } from "../../types/myTeam";
import { setTeamTypes } from "../../features/myTeam";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { RootState } from "../../app/store";
import TableOutlet from "../../components/common/TableOutlet";
import { setCurrentPage, setRowsPerPage } from "../../features/myTeam";

const TeamGroup = () => {
  const dispatch = useDispatch();
  const { rowperpage, currentpage } = useSelector(
    (state: RootState) => state.myTeam
  );
  const { data, refetch } = useGetTeamsQuery(
    { page: currentpage, pageSize: rowperpage },
    { refetchOnMountOrArgChange: true }
  );

  const totalRows = data?.count || 0;
  const IndexofFirstItem = (currentpage - 1) * rowperpage + 1;
  const IndexofLastItem = Math.min(currentpage * rowperpage, totalRows);

  const [deleteTeam] = useDeleteTeamByIdMutation();
  const [updateTeam] = useUpdateTeamByIdMutation();
  const [addTeam] = useAddTeamMutation();

  const [editValue, setEditValue] = useState({
    id: null as number | null,
    team_name: "",
  });

  useEffect(() => {
    if (data?.results && Array.isArray(data.results)) {
      const options = data.results.map((item: Team) => ({
        value: item.id.toString(),
        label: item.team_name,
      }));
      dispatch(setTeamTypes(options));
    }
  }, [data, dispatch]);

  const handleEditClick = (item: Team) => {
    setEditValue({ id: item.id, team_name: item.team_name });
  };

  const handleCancelEdit = () => {
    setEditValue({ id: null, team_name: "" });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editValue.id) return;

    try {
      await updateTeam({
        id: editValue.id,
        data: { team_name: editValue.team_name },
      }).unwrap();
      alert("Team updated successfully!");
      handleCancelEdit();
      refetch();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update team.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team?"
    );
    if (!confirmDelete) return;

    try {
      await deleteTeam(id).unwrap();
      alert("Team deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete team.");
    }
  };

  const handleAddTeam = async () => {
    const team_name = prompt("Enter new team group:");
    if (!team_name) return;

    try {
      await addTeam({ team_name }).unwrap();
      alert("Team added successfully!");
      refetch();
    } catch (error) {
      console.error("Add failed:", error);
      alert("Failed to add Team.");
    }
  };

  return (
    <ComponentCard
      title="Team Groups"
      desc="Manage your team groups here."
      button={
        <Button variant="warning" onClick={handleAddTeam}>
          <PlusIcon />
        </Button>
      }
    >
      <TableOutlet
        pageSizeOptions={[5, 7, 10, 15]}
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
                Group Name
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
              data.results.map((item: Team) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {editValue.id === item.id ? (
                      <form
                        onSubmit={handleUpdate}
                        className="inline-flex items-center gap-2"
                      >
                        <Input
                          name="name"
                          value={editValue.team_name}
                          onChange={(e) =>
                            setEditValue((prev) => ({
                              ...prev,
                              team_name: e.target.value,
                            }))
                          }
                        />
                        <button type="submit">
                          <CheckCircleIcon className="size-5 text-green-500 hover:text-green-600" />
                        </button>
                        <button type="button" onClick={handleCancelEdit}>
                          <CloseIcon className="size-5 text-red-500 hover:text-red-700" />
                        </button>
                      </form>
                    ) : (
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {item.team_name}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-3">
                      <PencilIcon
                        className="size-5 cursor-pointer hover:text-blue-800 text-blue-500"
                        onClick={() => handleEditClick(item)}
                      />
                      <TrashBinIcon
                        className="size-5 cursor-pointer hover:text-red-800 text-red-500"
                        onClick={() => handleDelete(item.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="px-5 py-4 text-center text-gray-500">
                  No Group Created
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableOutlet>
    </ComponentCard>
  );
};

export default TeamGroup;
