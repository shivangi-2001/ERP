import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";
import DatePicker from "../../../components/form/date-picker";
import InputSelect from "../../../components/form/InputSelect";

import { RootState } from "../../../app/store";
import {
  useEditUrlMappingByIDMutation,
  useGetUrlMappingByIDQuery,
} from "../../../service/project";
import Form from "../../../components/form/Form";
import TextArea from "../../../components/form/input/TextArea";

interface SendToAssessmentProps {
  url_mapping_id: number;
}

const SendToAssessment: React.FC<SendToAssessmentProps> = ({
  url_mapping_id,
}) => {
  const { compliance, rowperpage, currentpage } = useSelector(
    (state: RootState) => state.assessment
  );
  const { employees } = useSelector((state: RootState) => state.myTeam);

  const { data: urlMappingById } = useGetUrlMappingByIDQuery({
    id: url_mapping_id || 0,
  });

  const [editUrlMappingById, { isLoading }] = useEditUrlMappingByIDMutation();

  const [errors, setErrors] = useState<any>({});
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Main State
  const [formData, setFormData] = useState({
    url: "",
    start_date: "",
    end_date: "",
    qa_date: "",
    // Keeping nested objects for reference if needed, but logic relies on IDs
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
    // ID fields for submission
    tester_id: undefined as number | undefined,
    client_assessment_id: undefined as number | undefined,
    compliance_id: undefined as number | undefined,
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
          assessment_type:
            urlMappingById?.client_assessment?.assessment_type || 0,
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
        client_assessment_id:
          urlMappingById?.client_assessment?.assessment_type,
        tester_id: urlMappingById?.tester?.id,
        compliance_id: urlMappingById?.compliance?.id,
      });
    }
  }, [urlMappingById]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // New handler for TextArea (direct value)
  const handleValueChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (
    field: string,
    option: { value: string; label: string }
  ) => {
    setFormData((prev) => ({ ...prev, [field]: Number(option.value) }));
  };

  const testerOptions = useMemo(() => {
    if (!employees?.results) return [];
    return employees.results.map((item: any) => ({
      label: `${item.first_name} ${item.last_name}`,
      value: item.id.toString(),
    }));
  }, [employees]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrors({});

    try {
      const payload = {
        url: formData.url,
        start_date: formData.start_date,
        end_date: formData.end_date,
        qa_date: formData.qa_date,
        tester_id: formData.tester_id,
        compliance_id: formData.compliance_id,
      };

      // Corrected mutation call structure
      await editUrlMappingById({ 
        id: url_mapping_id, 
        body: payload 
      }).unwrap();

      setStatusMessage({
        type: "success",
        text: "URL details updated successfully!",
      });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      console.error("Update failed", error);
      if (error?.data) {
        setErrors(error.data);
        setStatusMessage({
          type: "error",
          text: "Please correct the errors below.",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: "Failed to update details. Try again.",
        });
      }
    }
  };

  return (
    <ComponentCard title="Send To Assessment">
      {statusMessage && (
        <div className="mb-4">
          <Alert
            variant={statusMessage.type}
            title={statusMessage.type === "success" ? "Success" : "Error"}
            message={statusMessage.text}
          />
        </div>
      )}
      <Form onSubmit={handleSubmit}>
        <div className="space-y-4 mt-4 p-5">
          <div>
            <Label htmlFor="url">URL</Label>
            <TextArea
              rows={6} // Fixed prop name
              id="url"
              name="url"
              value={formData.url}
              onChange={(val) => handleValueChange("url", val)}
              placeholder="https://example.com"
              error={!!errors.url}
              hint={errors.url}
              disabled={true}
            />
          </div>

          <div className="flex flex-row gap-3 justify-between w-full">
            <div className="w-1/2">
              <Label>Tester</Label>
              <InputSelect
                name="tester_id"
                placeholder="Select Tester"
                defaultValue={formData.tester.first_name+formData.tester.last_name}
                options={testerOptions}
                onSelect={(opt) => handleSelectChange("tester_id", opt)}
                error={!!errors.tester_id}
                hint={errors.tester_id}
              />
            </div>

            <div className="w-1/2">
              <Label>Compliance</Label>
              <InputSelect
                name="compliance_id"
                placeholder="Select Standard"
                options={compliance}
                defaultValue={formData.compliance.name}
                onSelect={(opt) => handleSelectChange("compliance_id", opt)}
                error={!!errors.compliance_id}
                hint={errors.compliance_id}
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
                onChange={(val) => handleDateChange("start_date", val)}
                placeholder="YYYY-MM-DD HH:MM"
              />
            </div>
            <div>
              <DatePicker
                id="end_date"
                label="End Date"
                enableTime={true}
                defaultDate={formData.end_date}
                onChange={(val) => handleDateChange("end_date", val)}
                placeholder="YYYY-MM-DD HH:MM"
              />
            </div>
            <div>
              <DatePicker
                id="qa_date"
                label="QA Date"
                enableTime={true}
                defaultDate={formData.qa_date}
                onChange={(val) => handleDateChange("qa_date", val)}
                placeholder="YYYY-MM-DD HH:MM"
              />
            </div>
          </div>
          <div className="border-t flex justify-end pt-4 gap-2">
            <Button size="sm" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
};

export default SendToAssessment;