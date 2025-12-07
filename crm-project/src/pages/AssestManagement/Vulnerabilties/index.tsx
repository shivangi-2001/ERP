import React, { useEffect, useState } from "react";
import VulnerabilityList from "./list";
import { useGetAssessmentsQuery } from "../../../service/assessment";
import { useDispatch, useSelector } from "react-redux";
import { setAssessmentTypes } from "../../../features/assessment";
import AddVulnerability from "./add";
import { RootState } from "../../../app/store";

const VulnerabilityIndex: React.FC = () => {
  const dispatch = useDispatch();
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
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <VulnerabilityList />
      <AddVulnerability />
    </div>
  );
};

export default VulnerabilityIndex;
