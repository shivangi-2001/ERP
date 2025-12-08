import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useGetAssessmentsQuery, useGetComplianceQuery } from "../service/assessment";
import {RootState} from "../app/store";
import { setAssessmentTypes, setCompliance } from "../features/assessment";
import { useGetClientDetailsQuery } from "../service/project";
import { setClientDetails } from "../features/project";
import { useGetEmployeeQuery } from "../service/myTeam";
import { setEmployees, setSelectedEmployee } from "../features/myTeam";


const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const dispatch = useDispatch();

  // get the assessment type list
  const { rowperpage, currentpage } = useSelector((state: RootState) => state.assessment)
  const { data: assessments } = useGetAssessmentsQuery({page: currentpage, pageSize:rowperpage}, {
    refetchOnMountOrArgChange: true
  });
  useEffect(() => {
    if (assessments?.results) {
      const options = assessments.results.map((a) => ({
        value: a.id.toString(),
        label: a.name,
      }));
      dispatch(setAssessmentTypes(options));
    }
  }, [assessments, dispatch]);

  const { rowperpage: rowperpage1, currentpage: currentpage1 } = useSelector((state: RootState) => state.assessment)
  const { data: compliance } = useGetComplianceQuery({page: currentpage1, pageSize:rowperpage1}, {
    refetchOnMountOrArgChange: true
  });
  useEffect(() => {
    if (compliance?.results) {
      const options = compliance.results.map((a) => ({
        value: a.id.toString(),
        label: a.name,
      }));
      dispatch(setCompliance(options));
    }
  }, [assessments, dispatch]);


  // client list
  const { rowperpage: rowperpage2, currentpage: currentpage2 } = useSelector((state: RootState) => state.project)
  const { data: clientsDetails } = useGetClientDetailsQuery({ page: currentpage2 , pageSize: rowperpage2}, { refetchOnMountOrArgChange: true });
  
  useEffect(() => {
    if (clientsDetails?.results) {
      dispatch(setClientDetails(clientsDetails));
    }
  }, [clientsDetails, dispatch]);

  // Employee list (Tester)
  const { rowperpage: rowperpage3, currentpage: currentpage3 } = useSelector((state: RootState) => state.myTeam)
  const { data: employeeList } = useGetEmployeeQuery({ page: currentpage3, pageSize: rowperpage3 }, { refetchOnMountOrArgChange: true });
  useEffect(() => {
    if(employeeList?.results && employeeList.results.length > 0) {
      dispatch(setEmployees(employeeList));
      if (employeeList.results.length>0) {
        dispatch(setSelectedEmployee(employeeList.results[0]));
      }
    }
  }, [employeeList?.results, dispatch]);


  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
