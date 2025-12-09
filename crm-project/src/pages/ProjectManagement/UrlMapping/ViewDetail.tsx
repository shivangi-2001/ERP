import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import DatePicker from "../../../components/form/date-picker";
import InputSelect from "../../../components/form/InputSelect";

import { RootState } from "../../../app/store";
import { useGetUrlMappingByIDQuery } from "../../../service/project";
import TextArea from "../../../components/form/input/TextArea";

interface ViewDetailProps {
  url_mapping_id: number;
}
const ViewDetail: React.FC<ViewDetailProps> = ({ url_mapping_id }) => {
  const { compliance, assessment_types, rowperpage, currentpage } = useSelector(
    (state: RootState) => state.assessment
  );
  const { employees } = useSelector((state: RootState) => state.myTeam);

  const { data: urlMappingById } = useGetUrlMappingByIDQuery({
    id: url_mapping_id || 0,
  });

  console.log(urlMappingById);

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    qa_date: "",
    url: "",
    client_assessment: {
      id: 0,
      client_name: "",
      assessment_type: 0,
      assessment_type_name: "",
    },
    tester: {
      id: 0,
      email: "",
      first_name: "",
      last_name: "",
    },
    compliance: {
      id: 0,
      name: "",
    },
  });

  useEffect(() => {
    if (urlMappingById?.url) {
      setFormData({
        start_date: urlMappingById?.start_date,
        end_date: urlMappingById?.end_date,
        qa_date: urlMappingById?.qa_date,
        url: urlMappingById?.url,
        client_assessment: {
          id: urlMappingById?.client_assessment?.id || 0,
          client_name: urlMappingById?.client_assessment?.client_name || "",
          assessment_type: urlMappingById?.client_assessment?.assessment_type || 0,
          assessment_type_name:
            urlMappingById?.client_assessment?.assessment_type_name || "",
        },
        tester: {
          id: urlMappingById?.tester?.id || 0,
          email: urlMappingById?.tester?.email || "",
          first_name: urlMappingById?.tester?.first_name || "",
          last_name: urlMappingById?.tester?.last_name || "",
        },
        compliance: {
          id: urlMappingById?.compliance?.id || 0,
          name: urlMappingById?.compliance?.name || "",
        },
      });
    }
  }, [urlMappingById]);

  const testerOptions = useMemo(() => {
    if (!employees?.results) return [];
    return employees.results.map((item: any) => ({
      label: `${item.first_name} ${item.last_name}`,
      value: item.id.toString(),
    }));
  }, [employees]);

  return (
    <ComponentCard title="View URL Details">
      <div className="space-y-4 mt-4 p-5">
        <div>
          <Label htmlFor="url">URL</Label>
          <TextArea
            rows={6}
            id="url"
            name="url"
            value={formData.url}
            placeholder="https://example.com"
            disabled={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label>Assessment Type</Label>
            <InputSelect
              name="client_id"
              placeholder="Select Assessment"
              options={assessment_types}
              defaultValue={formData.client_assessment.assessment_type_name}
              onSelect={() => console.log("It will not work")}
              hint=""
              disabled={true}
            />
          </div>

          <div>
            <Label>Tester</Label>
            <InputSelect
              name="tester_id"
              placeholder="Select Tester"
              defaultValue={
                formData.tester.first_name + formData.tester.last_name
              }
              options={testerOptions}
              onSelect={() => console.log("It will not work")}
              hint=""
              disabled={true}
            />
          </div>

          <div>
            <Label>Compliance</Label>
            <InputSelect
              name="compliance_id"
              placeholder="Select Standard"
              options={compliance}
              defaultValue={formData.compliance.name}
              onSelect={() => console.log("It will not work")}
              hint=""
              disabled={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <DatePicker
              id="start_date"
              label="Start Date"
              enableTime={true}
              defaultDate={formData.start_date}
              disabled={true}
              placeholder="YYYY-MM-DD HH:MM"
            />
          </div>
          <div>
            <DatePicker
              id="end_date"
              label="End Date"
              enableTime={true}
              defaultDate={formData.end_date}
              placeholder="YYYY-MM-DD HH:MM"
              disabled={true}
            />
          </div>
          <div>
            <DatePicker
              id="qa_date"
              label="QA Date"
              enableTime={true}
              defaultDate={formData.qa_date}
              placeholder="YYYY-MM-DD HH:MM"
              disabled={true}
            />
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default ViewDetail;
