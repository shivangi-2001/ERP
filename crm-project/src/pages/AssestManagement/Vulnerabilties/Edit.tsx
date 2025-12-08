import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../../components/common/ComponentCard";
import Form from "../../../components/form/Form";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { RootState } from "../../../app/store";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import { useUpdateVulnerabilityByIdMutation } from "../../../service/assessment";
import Alert from "../../../components/ui/alert/Alert";
import { Vulnerability } from "../../../types/assessment";
import TextArea from "../../../components/form/input/TextArea"; // Ensure path is correct
import { CalenderIcon, PencilIcon } from "../../../icons";
import { toggleEditing } from "../../../features/assessment";

const EditVulnerability = () => {
  const dispatch = useDispatch();
  const { selected_vulnerability, assessment_types, isEditing } = useSelector(
    (state: RootState) => state.assessment
  );

  const [updateVulnerability, { isLoading }] = useUpdateVulnerabilityByIdMutation();

  const [formData, setFormData] = useState<Partial<Vulnerability>>({
    id: 0,
    name: "",
    description: "",
    impact: "",
    reference: "",
    remediations: "",
    cvss: "",
    category_of_testing_id: 0,
  });

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  
  const [fieldErrors, setFieldErrors] = useState<any>({});

  useEffect(() => {
    if (selected_vulnerability) {
      setFormData({
        id: selected_vulnerability.id,
        name: selected_vulnerability.name || "",
        description: selected_vulnerability.description || "",
        impact: selected_vulnerability.impact || "",
        reference: selected_vulnerability.reference || "",
        remediations: selected_vulnerability.remediations || "",
        cvss: selected_vulnerability.cvss || "",
        category_of_testing_id: selected_vulnerability.category_of_testing_id || 0,
      });
    }
  }, [selected_vulnerability]);

  // Unified Handler: Accepts the field name and the direct value
  const handleChange = (field: keyof Vulnerability, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error for this field if it exists
    if (fieldErrors[field]) {
        setFieldErrors((prev: any) => ({ ...prev, [field]: undefined }));
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

    if (!selected_vulnerability?.id) {
      setStatusMessage({
        type: "error",
        text: "No vulnerability selected to update.",
      });
      return;
    }

    try {
      await updateVulnerability({
        id: selected_vulnerability.id,
        data: formData, // Send the clean formData object
      }).unwrap();

      setStatusMessage({
        type: "success",
        text: "Vulnerability updated successfully!",
      });
      
      // Optional: Turn off editing mode on success
      if(isEditing) dispatch(toggleEditing());
      
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      console.error("Error updating vulnerability:", error);

      if (error?.data) {
        setFieldErrors(error.data);
        const detailMsg = error.data.detail || "Failed to update vulnerability.";
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
    <ComponentCard 
        title="Edit Vulnerability" 
        className="h-fit" 
        button={
            <button onClick={() => dispatch(toggleEditing())} type="button">
                <PencilIcon className={`size-6 hover:text-blue-700 ${!isEditing ? "text-blue-500" : "text-gray-400"}`}/>
            </button>
        }
    >
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
        <div className="flex flex-col gap-2">
          
          {/* Row 1: Name and CVSS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">
                Vulnerability Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="name"
                // Assuming Input returns an Event
                onChange={(e) => handleChange("name", e.target.value)} 
                value={formData.name || ""}
                placeholder="e.g. SQL Injection"
                disabled={!isEditing}
                error={!!fieldErrors.name}
                hint={fieldErrors.name}
              />
            </div>

            <div>
              <Label htmlFor="cvss">CVSS Score</Label>
              
              <div className="relative">
              <Input
                type="text"
                id="cvss"
                className="pl-15"
                onChange={(e) => handleChange("cvss", e.target.value)}
                value={formData.cvss || ""}
                placeholder="e.g. 9.8 (Critical)"
                disabled={!isEditing}
                error={!!fieldErrors.cvss}
                hint={fieldErrors.cvss}
                
              />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <CalenderIcon className="size-6" />
            </span>
          </div>
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
              // Select usually returns the value directly
              onChange={(val) => handleChange("category_of_testing_id", Number(val))}
              defaultValue={formData.category_of_testing_id}
              disabled={!isEditing}
              error={!!fieldErrors.category_of_testing_id}
              hint={fieldErrors.category_of_testing_id}
            />
          </div>

          {/* Row 3: Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              // TextArea returns value string directly
              onChange={(val) => handleChange("description", val)}
              value={formData.description || ""}
              placeholder="Detailed description of the vulnerability..."
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
              error={!!fieldErrors.reference}
              hint={fieldErrors.reference}
              rows={2}
            />
          </div>
        </div>

        {/* Action Button: Only show when editing */}
        {isEditing && (
            <div className="flex flex-row-reverse mt-10 border-t pt-4">
            <Button disabled={isLoading}>
                {isLoading ? "Saving..." : "Edit Changes"}
            </Button>
            </div>
        )}
      </Form>
    </ComponentCard>
  );
};

export default EditVulnerability;