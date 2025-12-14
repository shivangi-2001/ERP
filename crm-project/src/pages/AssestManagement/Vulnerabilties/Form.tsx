import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ComponentCard from "../../../components/common/ComponentCard";
import Form from "../../../components/form/Form";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";
import TextArea from "../../../components/form/input/TextArea";
import { RootState } from "../../../app/store";
import { Vulnerability } from "../../../types/assessment";
import { useAddVulnerabilityMutation } from "../../../service/assessment";
import { CalenderIcon } from "../../../icons";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../../components/ui/modal";
import CVSS from "../CVSS/Index";

const VulnerabilityForm = () => {
  const { isOpen, closeModal, toggleModal } = useModal();
  
  // Redux Selectors
  const { baseScore, severity } = useSelector((state: RootState) => state.cvss);
  const { assessment_types } = useSelector((state: RootState) => state.assessment);

  const [addVulnerability, { isLoading }] = useAddVulnerabilityMutation();

  const initialFormState: Partial<Vulnerability> = {
    name: "",
    description: "",
    impact: "",
    reference: "",
    remediations: "",
    cvss: "", // Start empty, let useEffect populate it
    category_of_testing_id: 0,
  };

  const [formData, setFormData] = useState<Partial<Vulnerability>>(initialFormState);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (baseScore && severity) {
        setFormData(prev => ({
            ...prev,
            cvss: `${baseScore} (${severity})`
        }));
    }
  }, [baseScore, severity]);

  const handleChange = (field: keyof Vulnerability, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrors({});

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
        description: formData.description,
        impact: formData.impact,
        reference: formData.reference,
        remediations: formData.remediations,
        cvss: formData.cvss,
      }).unwrap();

      setStatusMessage({
        type: "success",
        text: "Vulnerability added successfully!",
      });

      setFormData(initialFormState);

      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      console.error("Error adding vulnerability:", error);

      if (error?.data) {
        setErrors(error.data);
        const detailMsg = error.data.detail || "Failed to add vulnerability. Please check inputs.";
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
      
      {statusMessage && (
        <div className="mb-4 p-5">
          <Alert
            variant={statusMessage.type}
            title={statusMessage.type === "success" ? "Success" : "Error"}
            message={statusMessage.text}
          />
        </div>
      )}

      {/* CVSS Calculator Modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <CVSS />
      </Modal>

      <Form onSubmit={handleSubmit} className="space-y-6 p-5">
          
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
                error={!!errors.name}
                hint={errors.name}
              />
            </div>

            <div>
                <Label htmlFor="cvss">CVSS Score</Label>
                <div className="relative">
                <Input
                    type="text"
                    id="cvss"
                    className="pl-12" // Add padding-left to make room for icon
                    onChange={(e) => handleChange("cvss", e.target.value)}
                    value={formData.cvss || ""}
                    placeholder="e.g. 9.8 (Critical)"
                    error={!!errors.cvss}
                    hint={errors.cvss}
                />
                <span 
                    onClick={toggleModal} 
                    className="absolute left-0 top-0 h-11 w-11 flex items-center justify-center border-r border-gray-200 text-gray-500 cursor-pointer hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
                    title="Open CVSS Calculator"
                >
                    <CalenderIcon className="size-5 text-theme-sm" />
                </span>
                </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category_of_testing_id">
              Category of Testing <span className="text-red-500">*</span>
            </Label>
            <Select
              options={assessment_types || []}
              placeholder="Select category"
              onChange={(val) => handleChange("category_of_testing_id", Number(val))}
              defaultValue={formData.category_of_testing_id}
              disabled={false}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              onChange={(val) => handleChange("description", val)}
              value={formData.description || ""}
              placeholder="Detailed description..."
              error={!!errors.description}
              hint={errors.description}
              rows={4}
            />
          </div>

          {/* Impact */}
          <div>
            <Label htmlFor="impact">Impact</Label>
            <TextArea
              id="impact"
              onChange={(val) => handleChange("impact", val)}
              value={formData.impact || ""}
              placeholder="Business impact..."
              error={!!errors.impact}
              hint={errors.impact}
              rows={3}
            />
          </div>

          {/* Remediations */}
          <div>
            <Label htmlFor="remediations">Remediations</Label>
            <TextArea
              id="remediations"
              onChange={(val) => handleChange("remediations", val)}
              value={formData.remediations || ""}
              placeholder="Steps to fix..."
              error={!!errors.remediations}
              hint={errors.remediations}
              rows={3}
            />
          </div>

          {/* References */}
          <div>
            <Label htmlFor="reference">References</Label>
            <TextArea
              id="reference"
              onChange={(val) => handleChange("reference", val)}
              value={formData.reference || ""}
              placeholder="Links to CVEs..."
              error={!!errors.reference}
              hint={errors.reference}
              rows={2}
            />
          </div>

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