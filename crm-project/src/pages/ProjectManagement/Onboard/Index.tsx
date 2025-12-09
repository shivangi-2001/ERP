import Card from "../../../components/common/Card";
import PageMeta from "../../../components/common/PageMeta";
import { Modal } from "../../../components/ui/modal";
import { useModal } from "../../../hooks/useModal";
import { PlusIcon } from "../../../icons";
import ClientForm from "../Client/Form";
import ClientTable from "../Client/Table";

const OnBoardIndex = () => {
  const { isOpen, toggleModal } = useModal();
  return (
    <>
      <PageMeta
        title="On-board Clients information"
        description="All clients details associated with our company."
      />
      <Card
        title="Client Details"
        desc="On-board clients information"
        enableSearch={true}
        searchPlaceholder="Search by client name e.g: zodox"
        buttonText="New Client"
        buttonStartIcon={<PlusIcon width={19} height={19} />}
        onButtonClick={() => toggleModal()}
      >
        <ClientTable />
      </Card>

      <Modal
        isFullscreen={false}
        isOpen={isOpen}
        onClose={() => toggleModal()}
        className="mx-auto"
      >
        <ClientForm />
      </Modal>
    </>
  );
};

export default OnBoardIndex;
