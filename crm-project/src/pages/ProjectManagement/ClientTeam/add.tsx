import { useEffect, useState } from "react";
import { Country } from "country-state-city";

import ComponentCard from "../../../components/common/ComponentCard";
import PhoneInput from "../../../components/form/group-input/PhoneInput";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";


const ClientTeamForm:React.FC = () => {
  const [countries, setCountries] = useState<
    { code: string; label: string; name: string }[]
  >([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [phoneData, setPhoneData] = useState<{
    dial_code: string;
    contact_number: string;
  }>({
    dial_code: "",
    contact_number: "",
  });

  useEffect(() => {
    const countryList = Country.getAllCountries().map((c) => ({
      code: c.isoCode,
      label: `+${c.phonecode}`,
      name: c.name,
    }));
    setCountries(countryList);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneNumberChange = ({
    code,
    number,
  }: {
    code: string;
    number: string;
  }) => {
    setPhoneData({
      dial_code: code,
      contact_number: number,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      dial_code: phoneData.dial_code,
      contact_number: phoneData.contact_number,
      email: formData.email,
      role: formData.role,
    };

    console.log("✅ Submitted Team Member:", payload);

  };

  return (
    <ComponentCard title={"Add Client Team Member"}>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
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
          />
        </div>

        <div>
          <Label>Personal Contact Number</Label>
          <PhoneInput
            selectPosition="start"
            countries={countries}
            placeholder="+91 (555) 000-0000"
            onChange={handlePhoneNumberChange}
          />
        </div>

        <div>
          <Label htmlFor="role">Designation</Label>
          <Input
            type="text"
            id="role"
            name="role"
            placeholder="e.g. DevSecOps Engineer"
            value={formData.role}
            onChange={handleInputChange}
          />
        </div>

        <div className="border-t flex justify-end pt-4">
          <Button size="sm">
            Add
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
};

export default ClientTeamForm;
