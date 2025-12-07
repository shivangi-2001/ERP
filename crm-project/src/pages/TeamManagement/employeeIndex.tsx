import AddEmployee from "./addEmployee";
import EmployeeList from "./employeeList";
import UpdateEmployee from "./updateEmployee";
import { setTeamTypes } from "../../features/myTeam";
import { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { useGetTeamsQuery } from "../../service/myTeam";
import { useEffect } from "react";
import { Team } from "../../types/myTeam";

function EmployeeIndex() {
  const dispatch = useDispatch();
  const { rowperpage, currentpage } = useSelector(
    (state: RootState) => state.myTeam
  );
  const { data, refetch } = useGetTeamsQuery(
    { page: currentpage, pageSize: rowperpage },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (data?.results && Array.isArray(data.results)) {
      const options = data.results.map((item: Team) => ({
        value: item.id.toString(),
        label: item.team_name,
      }));
      dispatch(setTeamTypes(options));
    }
  }, [data, dispatch]);
  return (
    <div className="grid md:grid-cols-2 gap-2">
      <AddEmployee />
      <div className="flex flex-col gap-4">
        <EmployeeList />
        <UpdateEmployee />
      </div>
    </div>
  );
}

export default EmployeeIndex;
