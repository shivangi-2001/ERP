import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Card from "../../components/common/Card";
import Form from "../../components/form/Form";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Alert from "../../components/ui/alert/Alert";
import { Modal } from "../../components/ui/modal";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import { CalenderIcon } from "../../icons";
import { useModal } from "../../hooks/useModal";
import { RootState } from "../../app/store";
import { Vulnerability } from "../../types/assessment";
import { useSearchVulnerabilityQuery } from "../../service/assessment";

import CVSS from "../AssestManagement/CVSS/Index";

const FindingForm = () => {
  const { isOpen, closeModal, toggleModal } = useModal();

  const { baseScore, severity } = useSelector((state: RootState) => state.cvss);
  const { assessment_types } = useSelector((state: RootState) => state.assessment);
  const { url_mapping } = useSelector((state: RootState) => state.project);

  const initialFormState: Partial<Vulnerability> = {
    name: "",
    description: "",
    impact: "",
    reference: "",
    remediations: "",
    cvss: "",
    category_of_testing_id: 0,
  };
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string;} | null>(null);

  const [formData, setFormData] = useState<Partial<Vulnerability>>(initialFormState);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (baseScore && severity) {
      setFormData((prev) => ({
        ...prev,
        cvss: `${baseScore} (${severity})`,
      }));
    }
  }, [baseScore, severity]);

  const handleChange = (field: keyof Vulnerability, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const [searchValue, setSearchValue] = useState<string>("");

  const {data:searchVulnerability, } = useSearchVulnerabilityQuery({
    assessment_type:url_mapping?.client_assessment?.assessment_type_name,
    search_text:searchValue
  }, {skip: !searchValue});

  const searchOption = useMemo(()=> {
    return searchVulnerability?.results.map((search: any) => (console.log(search),{
      label: search.name,
      value: search.id
    }))||[];
  }, [searchVulnerability?.results])

  const handleSearchSelect = (selectedItem: any) => {
    const selectedVuln = searchVulnerability?.results.find((v: any) => v.id === selectedItem.value);
    
    if (selectedVuln) {
      setFormData({
        name: selectedVuln.name,
        description: selectedVuln.description,
        impact: selectedVuln.impact,
        remediations: selectedVuln.remediations,
        reference: selectedVuln.reference,
        cvss: selectedVuln.cvss, // Check if your API returns this string
        category_of_testing_id: selectedVuln.category_of_testing_id || 0,
      });
      setSearchValue(""); 
    }
  };

  return (
    <Card 
      title="" 
      enableSearch={true}
      searchValue={searchValue}
      searchResults={searchOption}
      onSearchChange={(e: any) => setSearchValue(e.target.value)}
      onSearchSelect={handleSearchSelect}
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

      {/* CVSS Calculator Modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <CVSS />
      </Modal>

      <Form onSubmit={() => console.log("first")} className="p-5">
        <div className="flex flex-col gap-5">
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
              onChange={(val) =>
                handleChange("category_of_testing_id", Number(val))
              }
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
        </div>

        <div className="flex flex-row-reverse mt-10 border-t pt-4">
          {/* <Button disabled={isLoading}> */}
            {/* {isLoading ? "Saving..." : "Add Vulnerability"} */}
          {/* </Button> */}
        </div>
      </Form>
    </Card>
  );
};

export default FindingForm;
