import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import ComponentCard from "../../../components/common/ComponentCard";
import PhoneInput from "../../../components/form/group-input/PhoneInput";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert"; // Import Alert component
import { ClientTeam } from "../../../types/project";
import { getUniquePhoneCodes } from "../../../utils/location";
import { useCreateClientTeamMutation } from "../../../service/project";
import Form from "../../../components/form/Form";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const ClientTeamForm: React.FC = () => {
  const {clientdetail} =useSelector((state:RootState)=> state.project)
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ClientTeam>({
    name: "",
    email: "",
    mobile_code: "",
    mobile: "",
    designation: "",
    client: clientdetail?.id,
  });

  const [errors, setErrors] = useState<any>({});
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const getCountryPhoneCodes = useMemo(() => getUniquePhoneCodes(), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePhoneChange = ({ code, number }: { code: string; number: string }) => {
    setFormData((prev) => ({
      ...prev,
      mobile: number,
      mobile_code: code,
    }));
    
    if (errors.mobile) {
        setErrors((prev: any) => ({ ...prev, mobile: undefined }));
    }
  };

  const [createClientTeam, {isLoading}] = useCreateClientTeamMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if(!formData.name || !formData.email){
      setStatusMessage({text:"All fields are required.", type:"error"})
    }

    try {
      const payload: Partial<ClientTeam> = { ...formData, client: clientdetail?.id };
      await createClientTeam(payload).unwrap();
      setStatusMessage({
        type: "success",
        text: "Client Team Added successfully!",
      });
      navigate(0);
    } catch (error: any) {
      const globalMsg = 
        error?.data?.detail || 
        error?.data?.non_field_errors?.[0] || 
        "Failed to add client team member.";
      setStatusMessage({ type: "error", text: globalMsg });
      setErrors(error.data);
    }
  };

  return (
    <ComponentCard title={"Add Client Team Member"}>
      {/* Alert Notification */}
      {statusMessage && (<div className="mb-4">
        <Alert variant={statusMessage.type} title={`${formData?.name}`} message={statusMessage.text} />
      </div> )}

      <Form className="space-y-6 p-5" onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name} 
            hint={errors.name} 
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="email">Personal Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="personal_email@gmail.com"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            hint={errors.email}
          />
        </div>

        <div className="mb-4">
          <Label>Personal Contact Number</Label>
          <PhoneInput
            countries={getCountryPhoneCodes}
            defaultCode={formData.mobile_code}
            defaultNumber={formData.mobile}
            onChange={handlePhoneChange}
            error={!!errors.mobile}
            hint={errors.mobile}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="designation">Designation</Label>
          <Input
            type="text"
            id="designation"
            name="designation"
            placeholder="e.g. DevSecOps Engineer"
            value={formData.designation}
            onChange={handleInputChange}
            error={!!errors.designation}
            hint={errors.designation}
          />
        </div>

        <div className="flex justify-end pt-4 gap-2">
          <Button size="md" disabled={isLoading}>
            {isLoading ? "Saving..." : "Add Member"}
          </Button>
        </div>
      </Form>
    </ComponentCard>
  );
};

export default ClientTeamForm;
