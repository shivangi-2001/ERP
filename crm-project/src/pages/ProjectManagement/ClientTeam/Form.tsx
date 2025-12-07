import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ComponentCard from "../../../components/common/ComponentCard";
import PhoneInput from "../../../components/form/group-input/PhoneInput";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { getUniquePhoneCodes } from "../../../utils/location";
import { useCreateClientTeamMutation } from "../../../service/project";
import { RootState } from "../../../app/store";
import Alert from "../../../components/ui/alert/Alert";

interface ClientTeamFormData {
  name: string;
  email: string;
  mobile_code: string;
  mobile: string;
  designation: string;
  company: string | number;
}


const ClientTeamForm: React.FC = () => {
  const { clientdetail } = useSelector((state: RootState) => state.project);

  const [createClientTeam, { isLoading }] = useCreateClientTeamMutation();

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<ClientTeamFormData | any>({
    name: "",
    email: "",
    mobile_code: "+91",
    mobile: "",
    designation: "",
    company: "",
  });

  useEffect(() => {
    if (clientdetail?.id) {
      setFormData((prev: any) => ({ ...prev, company: clientdetail.id }));
    }
  }, [clientdetail]);

  const getCountryPhoneCodes = useMemo(() => getUniquePhoneCodes(), []);

  const handlePhoneChange = ({
    code,
    number,
  }: {
    code: string;
    number: string;
  }) => {
    setFormData((prev: any) => ({
      ...prev,
      mobile_code: code,
      mobile: number,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.company) {
      setStatusMessage({
        type: "error",
        text: "Company ID is missing. Please reload the page.",
      });
      return;
    }

    try {
      await createClientTeam(formData).unwrap();

      setStatusMessage({
        type: "success",
        text: "Team member added successfully!",
      });

      setFormData({
        name: "",
        email: "",
        mobile_code: "+91",
        mobile: "",
        designation: "",
        company: clientdetail?.id || "",
      });

    } catch (error: any) {
      console.error("Submission Error:", error);
      const errorMsg =
        error.data?.detail || "Failed to add member. Please check your inputs.";
      setStatusMessage({ type: "error", text: errorMsg });
    }
  };

  if (!clientdetail) return <div>Loading Company Details...</div>;

  return (
    <ComponentCard title={"Add Client Team Member"}>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        {statusMessage && (
          <Alert variant="success" title="" message={statusMessage.text} />
        )}

        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Personal Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="personal_email@gmail.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label>Personal Contact Number</Label>
          <PhoneInput
            selectPosition="start"
            countries={getCountryPhoneCodes}
            placeholder="+91 (555) 000-0000"
            defaultCode={formData.mobile_code}
            defaultNumber={formData.mobile}
            onChange={handlePhoneChange}
          />
        </div>

        <div>
          <Label htmlFor="designation">Designation</Label>
          <Input
            type="text"
            id="designation"
            name="designation"
            placeholder="e.g. DevSecOps Engineer"
            value={formData.designation}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="border-t flex justify-end pt-4">
          <Button size="sm" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Member"}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
};

export default ClientTeamForm;
