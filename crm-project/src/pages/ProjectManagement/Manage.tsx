import React, { useState } from "react";
import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import SearchBox from "../../components/common/SearchBox";
import { Modal } from "../../components/ui/modal";
import Card from "../../components/common/Card";
import Checkbox from "../../components/form/input/Checkbox";
import ClientJson from "../../utils/data.json";

const TableTitle = ["Client Name", "Action  "];

const Manage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [ClientId, setClientId] = useState<number>();
  const [selectedTesting, setSelectedTesting] = useState<string[]>();

  const handleClientId = (id: number) => {
    setClientId(id);
    const assignment_type = ClientJson.find(
      (client) => client.id == id
    )?.assessment_type;
    setSelectedTesting(assignment_type);
  };

  return (
    <div className="flex flex-col flex-1 gap-3">
      <SearchBox
        name="search_client"
        placeholder="Search Client"
        buttonText="search"
        classname="w-full"
      />
      <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {TableTitle.map((title, index) => (
                  <TableCell
                    isHeader
                    key={index}
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {ClientJson.map((data) => (
                <TableRow key={data.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <Link to={`/clients/${data.id}`}>
                      <div className="flex items-center gap-3">
                        {data.company_logo && (
                          <div className="w-10 h-10 overflow-hidden rounded-full">
                            <img
                              width={40}
                              height={40}
                              src={data.company_logo}
                              alt={data.company_name}
                            />
                          </div>
                        )}
                        <div>
                          <span className="block hover:underline hover:scale-105 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {data.company_name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {data.company_email}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setIsModalOpen(true);
                        handleClientId(data.id);
                      }}
                    >
                      Evalution
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Card title="Choose Assessment">
              {ClientId && selectedTesting && (
                <div className="flex flex-wrap gap-4">
                  {["Web", "Mobile", "Thick Client", "Network"].map((type) => (
                    <Checkbox
                      key={type}
                      label={type}
                      checked={selectedTesting.includes(type)}
                      onChange={(checked) => {
                        if (checked) {
                          setSelectedTesting((prev) => [...(prev || []), type]);
                        } else {
                          setSelectedTesting((prev) =>
                            (prev || []).filter((item) => item !== type)
                          );
                        }
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <Link to={`/clients/${ClientId}/assessment_type`}>
                    <Button>Proceed</Button>
                </Link>
              </div>
            </Card>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Manage;
