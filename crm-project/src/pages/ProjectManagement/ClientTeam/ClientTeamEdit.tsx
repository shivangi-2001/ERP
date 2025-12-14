import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ComponentCard from "../../../components/common/ComponentCard";
import PhoneInput from "../../../components/form/group-input/PhoneInput";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";
import Form from "../../../components/form/Form";

import { getUniquePhoneCodes } from "../../../utils/location";
import { RootState } from "../../../app/store";
import { ClientTeam } from "../../../types/project";
import { useEditClientTeamMutation } from "../../../service/project";

const ClientTeamEdit: React.FC = () => {
  const { clientdetail, clientteam } = useSelector((state: RootState) => state.project);

  const [editClientTeam, { isLoading }] = useEditClientTeamMutation();

  const [errors, setErrors] = useState<any>({});
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<ClientTeam>({
    name: "",
    email: "",
    mobile_code: "+91",
    mobile: "",
    designation: "",
    client: 0,
  });

  useEffect(() => {
    if (clientteam && clientdetail) {
      setFormData({
        name: clientteam.name,
        email: clientteam.email,
        mobile_code: clientteam.mobile_code || "+91",
        mobile: clientteam.mobile,
        designation: clientteam.designation,
        client: clientdetail.id, 
      });
    }
  }, [clientteam, clientdetail]);

  const getCountryPhoneCodes = useMemo(() => getUniquePhoneCodes(), []);

  const handlePhoneChange = ({ code, number }: { code: string; number: string }) => {
    setFormData((prev) => ({
      ...prev,
      mobile_code: code,
      mobile: number,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    // Safety check
    if (!clientteam?.id || !formData.client) {
      setStatusMessage({
        type: "error",
        text: "System Error: Missing Team ID or Company ID.",
      });
      return;
    }

    try {
      // 3. FIX: Pass { id, body } structure expected by RTK Query
      await editClientTeam({ 
        id: clientteam.id, 
        body: formData 
      }).unwrap();

      setStatusMessage({
        type: "success",
        text: "Team member updated successfully!",
      });

      

    } catch (error: any) {
      const globalMsg = 
        error?.data?.detail || 
        error?.data?.non_field_errors?.[0] || 
        "Failed to add client team member.";
      setStatusMessage({ type: "error", text: globalMsg });
      setErrors(error.data);

    }
  };

  if (!clientdetail || !clientteam) return <div>Select a team member to edit.</div>;

  return (
    <ComponentCard title={`Edit ${clientteam.name}`}>
      {statusMessage && (<div className="mb-4">
        <Alert variant={statusMessage.type} title={`${formData?.name}`} message={statusMessage.text} />
      </div> )}
      <Form className="space-y-6 p-5" onSubmit={handleFormSubmit}>
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name"
            error={!!errors.name}
            hint={errors.name}
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
            error={!!errors.email}
            hint={errors.email}
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
            error={!!errors.mobile}
            hint={errors.mobile}
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
            error={!!errors.designation}
            hint={errors.designation}
            required
          />
        </div>

        <div className="border-t flex justify-end pt-4 gap-2">
          <Button size="sm" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Form>
    </ComponentCard>
  );
};

export default ClientTeamEdit;