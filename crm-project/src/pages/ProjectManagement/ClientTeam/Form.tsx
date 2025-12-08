import { useEffect, useState } from "react";
import { Country } from "country-state-city";

import ComponentCard from "../../../components/common/ComponentCard";
import PhoneInput from "../../../components/form/group-input/PhoneInput";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert"; // Import Alert component

const ClientTeamForm: React.FC = () => {
  const [countries, setCountries] = useState<
    { code: string; label: string; name: string }[]
  >([]);

  // Form Data State
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

  // Error and Alert States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

    // Clear specific error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
    
    // Clear phone error when user types
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  // Validation Logic
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Full Name is required.";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!phoneData.dial_code || !phoneData.contact_number) {
        newErrors.phone = "Contact number is required.";
    } else if (phoneData.contact_number.length < 5) {
        newErrors.phone = "Contact number is too short.";
    }

    if (!formData.role.trim()) newErrors.role = "Designation is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    // 1. Run Validation
    if (!validateForm()) {
      setStatusMessage({ type: "error", text: "Please fix the errors below." });
      return;
    }

    // 2. Prepare Payload
    const payload = {
      name: formData.name,
      dial_code: phoneData.dial_code,
      contact_number: phoneData.contact_number,
      email: formData.email,
      role: formData.role,
    };

    console.log("✅ Submitted Team Member:", payload);

    // 3. Simulate Success (Replace with API call)
    setStatusMessage({ type: "success", text: "Team member added successfully!" });
    
    // 4. Reset Form
    setFormData({ name: "", email: "", role: "" });
    setPhoneData({ dial_code: "", contact_number: "" });
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <ComponentCard title={"Add Client Team Member"}>
        
      {/* Alert Notification */}
      {statusMessage && (
        <div className="mb-6">
          <Alert
            variant={statusMessage.type}
            title={statusMessage.type === "success" ? "Success" : "Error"}
            message={statusMessage.text}
          />
        </div>
      )}

      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name} // Show red border
            hint={errors.name}    // Show error text
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
          />
        </div>

        <div>
          <Label>Personal Contact Number</Label>
          <PhoneInput
            selectPosition="start"
            countries={countries}
            placeholder="+91 (555) 000-0000"
            onChange={handlePhoneNumberChange}
            // Assuming PhoneInput accepts error props, otherwise handle via separate text
            error={!!errors.phone} 
            hint={errors.phone}
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
            error={!!errors.role}
            hint={errors.role}
          />
        </div>

        <div className="border-t flex justify-end pt-4">
          <Button size="sm">Add</Button>
        </div>
      </form>
    </ComponentCard>
  );
};

export default ClientTeamForm;