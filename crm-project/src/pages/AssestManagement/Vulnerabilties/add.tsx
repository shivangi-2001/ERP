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

const AddVulnerability = () => {
  const { assessment_types } = useSelector((state: RootState) => state.assessment);
  const [addVulnerability] = useAddVulnerabilityMutation();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await addVulnerability({
        name,
        category_of_testing_id: Number(category),
      }).unwrap();

      alert("Vulnerability added successfully!");
      setName("");
      setCategory("");
    } catch (error) {
      console.error("Error adding vulnerability:", error);
      alert("Failed to add vulnerability.");
    }
  };

  return (
    <ComponentCard title="Add Vulnerability">
      <Form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 space-y-6">
          <div>
            <Label htmlFor="vulnName">Vulnerability Name</Label>
            <Input
              type="text"
              id="vulnName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter vulnerability name"
            />
          </div>

          <div>
            <Label htmlFor="category">Category of Testing</Label>
            <Select
              options={assessment_types}
              placeholder="Select category"
              onChange={(val) => setCategory(val)}
              defaultValue={category}
            />
          </div>
        </div>


        <div className="flex flex-row-reverse mt-10 border-t py-3">
          <Button>Submit</Button>
        </div>
      </Form>
    </ComponentCard>
  );
};

export default AddVulnerability;
