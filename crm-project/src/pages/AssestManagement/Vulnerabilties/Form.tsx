import { useState } from "react";
import { useSelector } from "react-redux";
import ComponentCard from "../../../components/common/ComponentCard";
import Form from "../../../components/form/Form";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { RootState } from "../../../app/store";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import { useAddVulnerabilityMutation } from "../../../service/assessment";
import Alert from "../../../components/ui/alert/Alert";
import { Vulnerability } from "../../../types/assessment";
import TextArea from "../../../components/form/input/TextArea";

const VulnerabilityForm = () => {
  const { assessment_types } = useSelector(
    (state: RootState) => state.assessment
  );

  const [addVulnerability, { isLoading }] = useAddVulnerabilityMutation();

  const initialFormState: Partial<Vulnerability> = {
    name: "",
    description: "",
    impact: "",
    reference: "",
    remediations: "",
    cvss: "",
    category_of_testing_id: 0,
  };

  const [formData, setFormData] =
    useState<Partial<Vulnerability>>(initialFormState);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 1. Generic Handler for Inputs
  const handleChange = (field: keyof Vulnerability, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this specific field if user types
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setFieldErrors({});

    // Basic Validation
    if (!formData.name || !formData.category_of_testing_id) {
      setStatusMessage({
        type: "error",
        text: "Please fill all required fields.",
      });
      return;
    }

    try {
      await addVulnerability({
        name: formData.name,
        category_of_testing_id: Number(formData.category_of_testing_id),
        // Send other fields
        description: formData.description,
        impact: formData.impact,
        reference: formData.reference,
        remediations: formData.remediations,
        cvss: formData.cvss,
      }).unwrap();

      // Success Logic
      setStatusMessage({
        type: "success",
        text: "Vulnerability added successfully!",
      });

      // Reset Form
      setFormData(initialFormState);

      // Clear success message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      console.error("Error adding vulnerability:", error);

      // Handle Django/Backend Errors
      if (error?.data) {
        setFieldErrors(error.data);
        const detailMsg =
          error.data.detail ||
          "Failed to add vulnerability. Please check inputs.";
        setStatusMessage({ type: "error", text: detailMsg });
      } else {
        setStatusMessage({
          type: "error",
          text: "Something went wrong. Please try again.",
        });
      }
    }
  };

  return (
    <ComponentCard title="Add Vulnerability" className="h-fit">
      {/* Alert Box */}
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
        <div className="flex flex-col gap-5">
          {/* Row 1: Name and CVSS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">
                Vulnerability Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="name"
                onChange={(e) => handleChange("name", e.target.value)}
                value={formData.name || ""}
                placeholder="e.g. SQL Injection"
                error={!!fieldErrors.name}
                hint={fieldErrors.name}
              />
            </div>

            <div>
              <Label htmlFor="cvss">CVSS Score</Label>
              <Input
                type="text"
                id="cvss"
                onChange={(e) => handleChange("cvss", e.target.value)}
                value={formData.cvss || ""}
                placeholder="e.g. 9.8 (Critical)"
                error={!!fieldErrors.cvss}
                hint={fieldErrors.cvss}
              />
            </div>
          </div>

          {/* Row 2: Category */}
          <div>
            <Label htmlFor="category_of_testing_id">
              Category of Testing <span className="text-red-500">*</span>
            </Label>
            <Select
              options={assessment_types || []}
              placeholder="Select category"
              onChange={(val) =>
                handleChange("category_of_testing_id", Number(val))
              }
              defaultValue={formData.category_of_testing_id}
              disabled={false}
              error={!!fieldErrors.category_of_testing_id}
              hint={fieldErrors.category_of_testing_id}
            />
          </div>

          {/* Row 3: Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              onChange={(val) => handleChange("description", val)}
              value={formData.description || ""}
              placeholder="Detailed description of the vulnerability..."
              error={!!fieldErrors.description}
              hint={fieldErrors.description}
              rows={4}
            />
          </div>

          {/* Row 4: Impact */}
          <div>
            <Label htmlFor="impact">Impact</Label>
            <TextArea
              id="impact"
              onChange={(val) => handleChange("impact", val)}
              value={formData.impact || ""}
              placeholder="What is the business impact?"
              error={!!fieldErrors.impact}
              hint={fieldErrors.impact}
              rows={3}
            />
          </div>

          {/* Row 5: Remediations */}
          <div>
            <Label htmlFor="remediations">Remediations</Label>
            <TextArea
              id="remediations"
              onChange={(val) => handleChange("remediations", val)}
              value={formData.remediations || ""}
              placeholder="Steps to fix the issue..."
              error={!!fieldErrors.remediations}
              hint={fieldErrors.remediations}
              rows={3}
            />
          </div>

          {/* Row 6: Reference */}
          <div>
            <Label htmlFor="reference">References</Label>
            <TextArea
              id="reference"
              onChange={(val) => handleChange("reference", val)}
              value={formData.reference || ""}
              placeholder="Links to CVEs or documentation..."
              error={!!fieldErrors.reference}
              hint={fieldErrors.reference}
              rows={2}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-row-reverse mt-10 border-t pt-4">
          <Button disabled={isLoading}>
            {isLoading ? "Saving..." : "Add Vulnerability"}
          </Button>
        </div>
      </Form>
    </ComponentCard>
  );
};

export default VulnerabilityForm;
