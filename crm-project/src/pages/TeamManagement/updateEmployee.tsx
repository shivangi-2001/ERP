import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import Form from "../../components/form/Form";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";
import { RootState } from "../../app/store";
import { useUpdateEmployeeByIdMutation } from "../../service/myTeam";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Select from "../../components/form/Select";
import { toggleEditing } from "../../features/myTeam";
import Alert from "../../components/ui/alert/Alert";

const UpdateEmployee = () => {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { selected_employee, team_groups, isEditing } = useSelector(
    (state: RootState) => state.myTeam
  );
  const [updateEmployee, { isLoading }] = useUpdateEmployeeByIdMutation();

  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState<Record<string, string>>({});

  // initialize form with selected employee data
  useEffect(() => {
    if (selected_employee) {
      setFormData({
        id: selected_employee.id,
        email: selected_employee.email,
        first_name: selected_employee.first_name,
        last_name: selected_employee.last_name,
        contact_number: selected_employee.contact_number,
        designation: selected_employee.designation,
        team_id: selected_employee?.team?.id || undefined,
        is_active: selected_employee.is_active,
        password: "",
      });
    }
  }, [selected_employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelect = (value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      team_id: value ? Number(value) : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setError({});

    // dynamically include only filled fields
    const payload: Record<string, any> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !(typeof value === "object" && Object.keys(value).length === 0)
      ) {
        payload[key] = value;
        console.log("key", key);
      }
    });

    try {
      if (!payload.id) {
        alert("Missing employee ID");
        return;
      }

      await updateEmployee({ id: payload.id, data: payload }).unwrap();
      setStatusMessage({
        type: "success",
        text: "Employee detail updated successfully!",
      });
      dispatch(toggleEditing());
    } catch (error: any) {
      const errorMsg =
        error.data?.detail || "Failed to update employee detail.";
      setStatusMessage({ type: "error", text: errorMsg });
      setError(error?.data);
    }
  };

  return (
    <ComponentCard
      title="Edit Employee Details"
      desc={`${formData.first_name} ${formData.last_name}`}
      isEditing={true}
      onEdit={() => dispatch(toggleEditing())}
    >
      {statusMessage && (
        <Alert
          variant={statusMessage.type}
          title={`${formData?.email}`}
          message={statusMessage.text}
        />
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
              value={formData.email || ""}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            {error.email && (
              <p className="text-error-500 text-sm">{error.email}</p>
            )}
          </div>

          {/* Password (optional) */}
          <div>
            <Label>Password (leave blank to keep current)</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                disabled={!isEditing}
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
            {error.password && (
              <p className="text-error-500 text-sm">{error.password}</p>
            )}
          </div>

          {/* Names */}
          <div className="flex flex-row gap-2">
            <div className="w-1/2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="John"
                value={formData.first_name || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Doe"
                value={formData.last_name || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <Label htmlFor="contact_number">Contact Number</Label>
            <Input
              id="contact_number"
              name="contact_number"
              placeholder="+91 9876543210"
              value={formData.contact_number || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {/* Designation */}
          <div>
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              name="designation"
              placeholder="Software Engineer"
              value={formData.designation || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {/* Team */}
          <div>
            <Label htmlFor="team_id">Team</Label>
            <Select
              key={formData.team_id || "team_select"}
              onChange={handleSelect}
              options={team_groups}
              placeholder="Select Team"
              defaultValue={formData.team_id?.toString() || ""}
              disabled={!isEditing}
            />
          </div>

          {/* Active checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active ?? true}
              onChange={(checked) =>
                setFormData((prev: any) => ({ ...prev, is_active: checked }))
              }
            />
            <Label htmlFor="is_active">Account Active</Label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-row-reverse mt-10 border-t py-3">
          <Button
            variant="primary"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Updating..." : "Update Employee"}
          </Button>
        </div>
      </Form>
    </ComponentCard>
  );
};

export default UpdateEmployee;
