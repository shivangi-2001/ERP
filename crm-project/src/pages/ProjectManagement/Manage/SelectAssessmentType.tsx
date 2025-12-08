import React from "react";
import { RootState } from "../../../app/store";
import { useGetClientAssessmentTypeQuery } from "../../../service/project";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../../components/common/ComponentCard";
import { Link } from "react-router"; 
import { setAssessmentTypeId } from "../../../features/assessment";
import { setClientAssessmentTypeId } from "../../../features/project";

interface SelectAssessmentTypeProps {
  ClientID: number;
}

const colorVariants = [
  "bg-red-100 text-red-700 ring-red-300 hover:bg-red-300",
  "bg-blue-100 text-blue-700 ring-blue-300 hover:bg-blue-300",
  "bg-yellow-100 text-yellow-700 ring-yellow-300 hover:bg-yellow-300",
  "bg-pink-100 text-pink-700 ring-pink-300 hover:bg-pink-300",
  "bg-green-100 text-green-700 ring-green-300 hover:bg-green-300",
  "bg-orange-100 text-orange-700 ring-orange-300 hover:bg-orange-300",
  "bg-purple-100 text-purple-700 ring-purple-300 hover:bg-purple-300",
  "bg-indigo-100 text-indigo-700 ring-indigo-300 hover:bg-indigo-300",
];

const SelectAssessmentType: React.FC<SelectAssessmentTypeProps> = ({ ClientID }) => {
    const dispatch = useDispatch();
  const { rowperpage, currentpage } = useSelector(
    (state: RootState) => state.project
  );

  const { data, isLoading } = useGetClientAssessmentTypeQuery({
    client_id: ClientID,
    page: currentpage,
    pageSize: rowperpage,
  });


  if (isLoading) return <div>Loading assessments...</div>;

  return (
    <ComponentCard title="Select Assessment Type">
      <div className="flex flex-row flex-wrap gap-3">
        {data?.results && data.results.length > 0 ? (
          data.results.map((item: any) => {
            
            const variantClass = colorVariants[item.id % colorVariants.length];

            return (
              <Link
                key={item.id}
                onClick={() => dispatch(setClientAssessmentTypeId(item))}
                to={`/client/${ClientID}?assessment_type=${item.assessment_type_name}`}
              >
                <button
                  className={`
                    px-4 py-2 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition ring-1 ring-inset
                    ${variantClass} 
                  `}
                >
                  {item.assessment_type_name}
                </button>
              </Link>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">No assessment types assigned.</p>
        )}
      </div>
    </ComponentCard>
  );
};

export default SelectAssessmentType;