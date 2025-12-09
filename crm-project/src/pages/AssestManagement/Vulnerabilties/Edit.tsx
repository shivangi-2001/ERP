import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../../components/common/ComponentCard";
import Form from "../../../components/form/Form";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import Alert from "../../../components/ui/alert/Alert";
import TextArea from "../../../components/form/input/TextArea"; 
import { CalenderIcon, PencilIcon } from "../../../icons";
import { useModal } from "../../../hooks/useModal";
import { RootState } from "../../../app/store";
import { Vulnerability } from "../../../types/assessment";
import { toggleEditing } from "../../../features/assessment";
import { useUpdateVulnerabilityByIdMutation } from "../../../service/assessment";
import CVSS from "../CVSS/Index";

const EditVulnerability = () => {
  const { isOpen, closeModal, toggleModal } = useModal();
  const dispatch = useDispatch();
  
  // 1. Get Data from Redux
  const { selected_vulnerability, assessment_types, isEditing } = useSelector(
    (state: RootState) => state.assessment
  );
  
  // 2. Get CVSS Data to sync calculator with form
  const { baseScore, severity } = useSelector((state: RootState) => state.cvss);

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

  // 3. Populate Form on Load
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

  // 4. Sync CVSS Calculator result to Form Data
  useEffect(() => {
    if (isEditing && baseScore && severity) {
        setFormData(prev => ({
            ...prev,
            cvss: `${baseScore} (${severity})`
        }));
    }
  }, [baseScore, severity, isEditing]);

  const handleChange = (field: keyof Vulnerability, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
        setFieldErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCvssClick = () => {
    if (isEditing) {
        toggleModal();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setFieldErrors({});

    if (!formData.name || !formData.category_of_testing_id) {
      setStatusMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    if (!selected_vulnerability?.id) {
      setStatusMessage({ type: "error", text: "No vulnerability selected." });
      return;
    }

    try {
      await updateVulnerability({
        id: selected_vulnerability.id,
        data: formData, 
      }).unwrap();

      setStatusMessage({ type: "success", text: "Vulnerability updated successfully!" });
      
      if(isEditing) dispatch(toggleEditing());
      
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      console.error("Error updating vulnerability:", error);
      if (error?.data) {
        setFieldErrors(error.data);
        const detailMsg = error.data.detail || "Failed to update vulnerability.";
        setStatusMessage({ type: "error", text: detailMsg });
      } else {
        setStatusMessage({ type: "error", text: "Something went wrong." });
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

      <Modal isOpen={isOpen} onClose={closeModal}>
        <CVSS />
      </Modal>
      
      <Form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          
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
                        className="pl-12"
                        onChange={(e) => handleChange("cvss", e.target.value)}
                        value={formData.cvss || ""}
                        disabled={!isEditing}
                        placeholder="e.g. 9.8 (Critical)"
                        error={!!fieldErrors.cvss}
                        hint={fieldErrors.cvss}
                    />
                    <span 
                        role="button"
                        aria-disabled={!isEditing}
                        onClick={handleCvssClick} 
                        className={`absolute left-0 top-0 h-11 w-11 flex items-center justify-center border-r border-gray-200  dark:border-gray-800 
                            ${isEditing ? "cursor-pointer text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5" : "cursor-not-allowed text-gray-300"}`}
                        title="Open CVSS Calculator"
                    >
                        <CalenderIcon className="size-5" />
                    </span>
                </div>
            </div>
          </div>

          <div>
            <Label htmlFor="category_of_testing_id">
              Category of Testing <span className="text-red-500">*</span>
            </Label>
            <Select
              options={assessment_types || []}
              placeholder="Select category"
              onChange={(val) => handleChange("category_of_testing_id", Number(val))}
              // Fix: Use selected_vulnerability ID for default value matching
              defaultValue={selected_vulnerability?.category_of_testing?.id || formData.category_of_testing_id}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              onChange={(val) => handleChange("description", val)}
              value={formData.description || ""}
              placeholder="Detailed description..."
              disabled={!isEditing}
              error={!!fieldErrors.description}
              hint={fieldErrors.description}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="impact">Impact</Label>
            <TextArea
              id="impact"
              onChange={(val) => handleChange("impact", val)}
              value={formData.impact || ""}
              placeholder="Business impact..."
              disabled={!isEditing}
              error={!!fieldErrors.impact}
              hint={fieldErrors.impact}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="remediations">Remediations</Label>
            <TextArea
              id="remediations"
              onChange={(val) => handleChange("remediations", val)}
              value={formData.remediations || ""}
              placeholder="Steps to fix..."
              disabled={!isEditing}
              error={!!fieldErrors.remediations}
              hint={fieldErrors.remediations}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="reference">References</Label>
            <TextArea
              id="reference"
              onChange={(val) => handleChange("reference", val)}
              value={formData.reference || ""}
              placeholder="Links to CVEs..."
              disabled={!isEditing}
              error={!!fieldErrors.reference}
              hint={fieldErrors.reference}
              rows={2}
            />
          </div>
        </div>

        {isEditing && (
            <div className="flex flex-row-reverse mt-10 border-t pt-4">
            <Button disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            </div>
        )}
      </Form>
    </ComponentCard>
  );
};

export default EditVulnerability;