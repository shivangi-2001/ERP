import { useState } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import SearchBox from "../../components/common/SearchBox";
import ClientTeamForm from "../ProjectManagement/ClientTeam/Form";

interface ClientTeam {
  name: string;
  email: string;
  role: string;
  dial_code: string;
  contact_number: string;
}

interface Props {
  team: ClientTeam;
}
const Spoc: React.FC<Props> = ({ team }) => {
  const [addModal, setAddModal] = useState(false);
  return (
    <Card title="Team Member">
      <div className="flex gap-2">
        <SearchBox placeholder="search teams" classname="" buttonText={`Change ${team.name}`} />
        <Button variant="error" onClick={() => setAddModal(true)}>+ Add</Button>
      </div>
      <div className="flex flex-col gap-2">
        <p>Name: {team.name}</p>
        <p>Email: {team.email}</p>
        <p>Role: {team.role}</p>
        <p>Contact number: {team.contact_number}</p>
      </div>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)}>
        <ClientTeamForm />
      </Modal>
    </Card>
  );
};

export default Spoc;
