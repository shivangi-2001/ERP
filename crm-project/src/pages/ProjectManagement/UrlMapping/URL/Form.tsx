import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import Alert from "../../../../components/ui/alert/Alert";
import { useCreateUrlMappingMutation } from "../../../../service/project";
import DatePicker from "../../../../components/form/date-picker";
import InputSelect from "../../../../components/form/InputSelect";
import { useGetClientAssessmentTypeQuery } from "../../../../service/project";
import { useSearchParams } from "react-router";

const UrlMappingForm = () => {
  const [searchParams] = useSearchParams();
  const { compliance, assessment_types } = useSelector((state: RootState) => state.assessment);
  const { clientdetail, client_assesment_type } = useSelector((state: RootState) => state.project);
  const { employees } = useSelector((state: RootState) => state.myTeam);
  const { data: assessmentData } = useGetClientAssessmentTypeQuery(
    { client_id: clientdetail?.id || 0, page: 1, pageSize: 100 },
    { skip: !clientdetail?.id }
  );

  const assessmentOptions = useMemo(() => {
    return assessmentData?.results.map((item: any) => ({
        label: item.assessment_type_name, 
        value: item.id.toString() 
    })) || [];
  }, [assessmentData]);

  const pre_select_assessment_option = useMemo(() => {
      if (client_assesment_type?.assessment_type && assessmentData?.results) {
          const match = assessmentData.results.find((item: any) => item.id === client_assesment_type.assessment_type);
          if (match) return match.assessment_type_name;
      }
      return searchParams.get('assessment_type');
  }, [client_assesment_type, assessmentData, searchParams]);

  const pre_client_assessment_id = useMemo(() => {
    assessment_types.map((assest: any) => {
        return assest.label === pre_select_assessment_option ? assest.value:0;
    })
}, [assessment_types]);

  const [createURLMapping, { isLoading }] = useCreateUrlMappingMutation();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    url: "",
    start_date: "",
    end_date: "",
    qa_date: "",
    tester_id: undefined as number | undefined,
    client_assessment_id: undefined as number | undefined, 
    compliance_id: undefined as number | undefined,
  });

  useEffect(( )=>{
    setFormData((prev) => ({ ...prev, client_assessment_id: pre_client_assessment_id }));
  }, [pre_client_assessment_id, setFormData])

  const [errors, setErrors] = useState<any>({});

  const testerOptions = useMemo(() => {
    return employees?.results.map((emp: any) => ({
        label: `${emp.first_name} ${emp.last_name}`,
        value: emp.id.toString()
    })) || [];
  }, [employees]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: undefined }));
  };

  const handleDateChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const handleSelectChange = (field: string, option: { value: string; label: string }) => {
    setFormData((prev) => ({ ...prev, [field]: Number(option.value) }));
    if (errors[field]) setErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrors({});

    if (!formData.url || !formData.client_assessment_id || !formData.tester_id) {
        setStatusMessage({ type: "error", text: "Please fill in all required fields." });
        return;
    }

    try {
        await createURLMapping(formData).unwrap();
        setStatusMessage({ type: "success", text: "URL Mapping added successfully!" });
        // Clear form but keep the pre-selected client_id
        setFormData(prev => ({
            ...prev, 
            url: "", 
            start_date: "", 
            end_date: "", 
            qa_date: ""
        }));
    } catch (error: any) {
        console.error(error);
        const msg = error.data?.detail || "Failed to save URL.";
        setStatusMessage({ type: "error", text: msg });
        if(error.data) setErrors(error.data);
    }
  };

  return (
    <ComponentCard title="Add URL Mapping">
      <form onSubmit={handleSubmit}>
        
        {statusMessage && (
            <Alert variant={statusMessage.type} title="" message={statusMessage.text} />
        )}

        <div className="space-y-4 mt-4">
            <div>
                <Label htmlFor="url">URL</Label>
                <Input
                    type="text"
                    id="url"
                    name="url" 
                    value={formData.url}
                    onChange={handleInputChange}
                    error={!!errors.url}
                    hint={errors.url}
                    placeholder="https://example.com"
                />
                
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                    <Label>Assessment Type</Label>
                    <InputSelect 
                        name="client_id"
                        placeholder="Select Assessment"
                        options={assessmentOptions}
                        defaultValue={pre_select_assessment_option} // Now a single string
                        onSelect={(opt) => handleSelectChange("client_assessment_id", opt)}
                        error={!!errors.client_id}
                        hint={errors.client_id}
                    />
                </div>

                <div>
                    <Label>Tester</Label>
                    <InputSelect 
                        name="tester_id"
                        placeholder="Select Tester"
                        options={testerOptions}
                        onSelect={(opt) => handleSelectChange("tester_id", opt)}
                        error={!!errors.tester_id}
                        hint={errors.tester_id}
                    />
                </div>

                <div>
                    <Label>Compliance</Label>
                    <InputSelect 
                        name="compliance_id"
                        placeholder="Select Standard"
                        options={compliance}
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
                    onChange={(val) => handleDateChange("start_date", val)}
                    error={!!errors.start_date}
                    placeholder="YYYY-MM-DD HH:MM"
                    />
                </div>
                <div>
                    <DatePicker
                    id="end_date"
                    label="End Date"
                    enableTime={true}
                    onChange={(val) => handleDateChange("end_date", val)}
                    error={!!errors.end_date}
                    placeholder="YYYY-MM-DD HH:MM"
                    />
                </div>
                <div>
                    <DatePicker
                    id="qa_date"
                    label="QA Date"
                    enableTime={true}
                    onChange={(val) => handleDateChange("qa_date", val)}
                    error={!!errors.qa_date}
                    placeholder="YYYY-MM-DD HH:MM"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button disabled={isLoading}>
                    {isLoading ? "Saving..." : "Add URL"}
                </Button>
            </div>
        </div>
      </form>
    </ComponentCard>
  );
};

export default UrlMappingForm;