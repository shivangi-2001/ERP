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
  
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string; } | null>(null);
  const [errors, setErrors] = useState<any>({});

  const { team_groups } = useSelector((state: RootState) => state.myTeam);
  
  const [addEmployee, { isLoading }] = useAddEmployeeMutation();

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

  const [error, setError] = useState<Record<string, string>>({});

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
    setError({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error[name])
      setError((prev: any) => ({ ...prev, [name]: undefined }));
  };

  const handleSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      team_id: value ? Number(value) : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (
      !formData.email ||
      !formData.password ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.team_id
    ) {
      alert("⚠️ Please fill in all required fields including Team.");
      return;
    }

    try {
      await addEmployee(formData).unwrap();
      setStatusMessage({
        type: "success",
        text: "Employee Added successfully!",
      });
      resetForm();
    } catch (error: any) {
      const errorMsg = error.data?.detail || "Failed to added employee detail.";
      setStatusMessage({ type: "error", text: errorMsg });
      setError(error?.data || {});
    }
  };

  return (
    <ComponentCard title="create employee account">
      {statusMessage && ( <Alert variant={statusMessage.type} title="" message={statusMessage.text} /> )}
      
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
              error={!!errors.name}
              hint={errors.name}
              required
            />
            {error.email && <p className="text-error-500 text-sm">{error.email}</p>}
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
            {error.password && <p className="text-error-500 text-sm">{error.password}</p>}
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
              />
              {error.first_name && (
                <p className="text-error-500 text-sm">{error.first_name}</p>
              )}
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
              />
              {error.last_name && (
                <p className="text-error-500 text-sm">{error.last_name}</p>
              )}
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
            />
            {error.contact_number && (
              <p className="text-error-500 text-sm">{error.contact_number}</p>
            )}
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
            />
            {error.designation && (
              <p className="text-error-500 text-sm">{error.designation}</p>
            )}
          </div>

          {/* Team Select */}
          <div>
            <Label htmlFor="team_id">
              Team (Group) <span className="text-error-500">*</span>
            </Label>
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
            {error.team_id && (
              <p className="text-error-500 text-sm">{error.team_id}</p>
            )}
          </div>

          {/* Active checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_active: checked }))
              }
            />
            <Label htmlFor="is_active">Account Active</Label>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex flex-row-reverse mt-10 border-t py-3">
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
