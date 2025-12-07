import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Card from "../../components/common/Card";
import { PlusIcon } from "../../icons";
import { Modal } from "../../components/ui/modal";
import AddClient from "./Client/Form";

const OnBoard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <PageMeta
        title="On-board Clients information"
        description="On-board clients details"
      />
      <div className="space-y-6">
        <Card
          title="Client Details"
          desc="On-board clients information"
          searchInput={true}
          searchPlaceholder="Search Clients"
          buttonText="New Client"
          buttonStartIcon={<PlusIcon width={19} height={19} />}
          onButtonClick={() => setIsModalOpen(true)}
        >
          <ClientTable />
        </Card>

        <Modal
          isFullscreen={false}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="mx-auto"
        >
          <AddClient />
        </Modal>
      </div>
    </>
  );
};

export default OnBoard;
