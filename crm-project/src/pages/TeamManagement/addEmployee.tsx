import { useState } from "react";
import { useSelector } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import Form from "../../components/form/Form";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";
import { RootState } from "../../app/store";
import { useAddEmployeeMutation } from "../../service/myTeam";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Select from "../../components/form/Select";
import Alert from "../../components/ui/alert/Alert";

const AddEmployee = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { team_groups } = useSelector((state: RootState) => state.myTeam);
  const [addEmployee, { isLoading }] = useAddEmployeeMutation();

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, any>>({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    contact_number: "",
    designation: "",
    team_id: undefined as number | undefined,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      contact_number: "",
      designation: "",
      team_id: undefined,
      is_active: true,
    });
    setFieldErrors({});
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear specific field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      team_id: value ? Number(value) : undefined,
    }));
    
    // Clear error for team_id
    if (fieldErrors.team_id) {
        setFieldErrors((prev) => ({ ...prev, team_id: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setFieldErrors({});

    // Basic Client-side Validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.team_id
    ) {
      setStatusMessage({ 
        type: "error", 
        text: "Please fill in all required fields marked with *." 
      });
      return;
    }

    try {
      await addEmployee(formData).unwrap();
      
      setStatusMessage({
        type: "success",
        text: "Employee added successfully!",
      });
      resetForm();

    } catch (error: any) {
      if (error.data) {
        setFieldErrors(error.data); 
        const detailMsg = error.data.detail || "Failed to add employee. Please fix the highlighted errors.";
        setStatusMessage({ type: "error", text: detailMsg });
      } else {
        setStatusMessage({ type: "error", text: "Network error. Please try again." });
      }
    }
  };

  // Helper to render error text (handles string or array from Django)
  const renderError = (fieldName: string) => {
    const err = fieldErrors[fieldName];
    if (!err) return null;
    return <p className="text-error-500 text-sm mt-1">{Array.isArray(err) ? err[0] : err}</p>;
  };

  return (
    <ComponentCard title="Create Employee Account" desc="Add new tester in your company" >
      {/* Alert Banner */}
      {statusMessage && (
        <div className="mb-6">
            <Alert 
                variant={statusMessage.type} 
                title={statusMessage.type === "success" ? "Success" : "Error"} 
                message={statusMessage.text} 
            />
        </div>
      )}
      
      <Form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Email */}
          <div>
            <Label htmlFor="email">
              Email <span className="text-error-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="employee@company.com"
              value={formData.email}
              onChange={handleChange}
              error={!!fieldErrors.email}
              required
            />
            {renderError("email")}
          </div>

          {/* Password */}
          <div>
            <Label>
              Password <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                error={!!fieldErrors.password}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
              </span>
            </div>
            {renderError("password")}
          </div>

          {/* First + Last Name */}
          <div className="flex flex-row gap-2">
            <div className="w-1/2">
              <Label htmlFor="first_name">
                First Name <span className="text-error-500">*</span>
              </Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                required
                error={!!fieldErrors.first_name}
              />
              {renderError("first_name")}
            </div>
            <div className="w-1/2">
              <Label htmlFor="last_name">
                Last Name <span className="text-error-500">*</span>
              </Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                required
                error={!!fieldErrors.last_name}
              />
              {renderError("last_name")}
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <Label htmlFor="contact_number">Contact Number</Label>
            <Input
              id="contact_number"
              name="contact_number"
              placeholder="+91 9876543210"
              value={formData.contact_number}
              onChange={handleChange}
              error={!!fieldErrors.contact_number}
            />
            {renderError("contact_number")}
          </div>

          {/* Designation */}
          <div>
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              name="designation"
              placeholder="Software Engineer"
              value={formData.designation}
              onChange={handleChange}
              error={!!fieldErrors.designation}
            />
            {renderError("designation")}
          </div>

          <div className="flex flex-row justify-between items-end gap-4">
            <div className="w-1/3 pb-3">
              {/* pb-3 adds a little spacing so the checkbox aligns perfectly with the text inside the input, not just the bottom border */}
              <Checkbox
                id="is_active"
                label="Account active"
                checked={formData.is_active ?? true}
                onChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>

            <div className="w-2/3">
              <Label htmlFor="team_id">Team</Label>
              <Select
              disabled={false}
              key={formData.team_id || "team_select"}
              onChange={handleSelect}
              options={
                team_groups?.map((team) => ({
                  label: team.label,
                  value: team.value.toString(),
                })) || []
              }
              placeholder="Select Team"
              defaultValue={formData.team_id?.toString() || ""}
            />
            </div>
          </div>

        
        </div>

        {/* Submit button */}
        <div className="flex flex-row-reverse mt-10 py-3">
          <Button
            variant="primary"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Saving..." : "Add Employee"}
          </Button>
        </div>
      </Form>
    </ComponentCard>
  );
};

export default AddEmployee;