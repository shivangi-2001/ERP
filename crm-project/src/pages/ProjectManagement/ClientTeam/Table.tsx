import React, { useMemo } from "react"; // Import useMemo
import { useDispatch, useSelector } from "react-redux";
import TableOutlet from "../../../components/common/TableOutlet";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "../../../components/ui/table";
import { RootState } from "../../../app/store";
import { PencilIcon, TrashBinIcon } from "../../../icons";
import { useDeleteClientTeamMutation } from "../../../service/project";
import { setClientTeam, setCurrentPage, setRowsPerPage, toggleEditingTeam } from "../../../features/project";
import { useNavigate } from "react-router";

const TableTitle = ["Name", "Contact Info", "Action"];

const ClientTeamTable: React.FC = () => {
  const navigate =useNavigate();
  const dispatch = useDispatch();
  const { clientteam, clientdetail, rowperpage, currentpage } = useSelector(
    (state: RootState) => state.project
  );

  const [deleteTeamMember, { isLoading: isDeleting }] =
    useDeleteClientTeamMutation();

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      try {
        await deleteTeamMember(id).unwrap();
        navigate(0);
      } catch (error) {
        console.error("Failed to delete team member", error);
      }
    }
  };

  const totalRows = clientdetail?.teams?.length || 0;
  
  const IndexofFirstItem = (currentpage - 1) * rowperpage + 1;
  const IndexofLastItem = Math.min(currentpage * rowperpage, totalRows);

  const visibleTeams = useMemo(() => {
    if (!clientdetail?.teams) return [];
    const startIndex = (currentpage - 1) * rowperpage;
    const endIndex = startIndex + rowperpage;
    return clientdetail.teams.slice(startIndex, endIndex);
  }, [clientdetail?.teams, currentpage, rowperpage]);

  return (
    <TableOutlet
      title="Client Team"
      desc={`Total Client Team: ${totalRows}`}
      pageSizeOptions={[5, 10, 15, 20]}
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
          {/* --- 3. Map over visibleTeams instead of clientdetail.teams --- */}
          {visibleTeams.length > 0 ? (
            visibleTeams.map((team) => (
              <TableRow
                onClick={() => dispatch(setClientTeam(team))}
                key={team.id}
                className={`${(clientteam)&&(team.id === clientteam.id)?"bg-blue-200 hover:bg-blue-100 dark:bg-yellow-900/30":"hover:bg-gray-50"} text-sm  dark:hover:bg-white/[0.03] transition-colors`}
              >
                {/* Name & Designation */}
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="font-medium text-gray-800 dark:text-white/90">
                    {team.name}
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {team.designation}
                  </p>
                </TableCell>

                {/* Email & Phone */}
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="text-gray-800 dark:text-white/90">
                    {team.email}
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {team.mobile_code} {team.mobile}
                  </p>
                </TableCell>

                {/* Actions */}
                <TableCell className="px-5 py-4 text-start">
                  <div className="flex items-center gap-3">
                  <button
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                      title="Edit Member"
                      onClick={() => {
                        console.log(team)
                        dispatch(toggleEditingTeam());
                        dispatch(setClientTeam(team))
                      }}
                    >
                      <PencilIcon className="size-5 text-blue-700 hover:text-blue-500" />
                    </button>

                    <button
                      onClick={() => handleDelete(team.id)}
                      disabled={isDeleting}
                      className="text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Remove Member"
                    >
                      <TrashBinIcon className="size-5 text-red-500 hover:text-red-800" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              {/* Added colSpan={3} to fix layout when empty */}
              <TableCell className="px-5 py-8 text-center text-gray-500">
                No team members found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableOutlet>
  );
};

export default ClientTeamTable;