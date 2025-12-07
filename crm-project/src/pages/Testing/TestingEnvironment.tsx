import { useParams, useLocation } from "react-router";
import SearchBox from "../../components/common/SearchBox";
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import ComponentCard from "../../components/common/ComponentCard";
import { useEffect, useState } from "react";
import ClientJson from "../../utils/data.json";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Spoc from "./spoc";
import UrlJsonData from "../../utils/urls.json";

const TableTitle = ["Urls", "Assigned To", "Action"];

type TestingUrl = { urls: string; assigned_to: number };

type AssessmentTypeData = {
  Web?: { testing_urls: TestingUrl[] };
  Mobile?: { testing_urls: TestingUrl[] };
  "Thick Client"?: { testing_urls: TestingUrl[] };
  Network?: { testing_urls: TestingUrl[] };
};

type UrlData = {
  client_id: number;
  assessment_type: AssessmentTypeData;
};


const UrlJson = UrlJsonData as UrlData[];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function TestingEnvironment() {
  const [name, setName] = useState<string | undefined>("");
  const [url, setUrl] = useState<{ urls: string; assigned_to: number }[] | undefined>();
  const [selectedTeamMember, setSelectedTeamMember] = useState<any | null>(null);
  const [spocModal, setSpocModal] = useState(false);
  const { id } = useParams();
  const query = useQuery();
  const assessmentType = query.get("assessment_type");

  type AssessmentKey = "Web" | "Mobile" | "Thick Client" | "Network";

  useEffect(() => {
    if (id && assessmentType) {
      const client = ClientJson.find((c) => c.id === Number(id));
      setName(client?.company_name);

      const urlData = UrlJson.find((u) => u.client_id === Number(id));
      const testingUrls = assessmentType && (assessmentType as AssessmentKey) in (urlData?.assessment_type || {})
      ? urlData?.assessment_type?.[assessmentType as AssessmentKey]?.testing_urls
      : undefined;

      if (Array.isArray(testingUrls)) {
        setUrl(testingUrls);
      } else {
        setUrl([]);
      }
    }
  }, [id, assessmentType]);

  const getTeamMemberName = (memberId: number): string => {
    const client = ClientJson.find((c) => c.id === Number(id));
    const member = client?.teams?.find((m) => m.id === memberId);
    return member?.name || "Unknown";
  };

  const handleSpoc = (teamId: number) => {
    const client = ClientJson.find((c) => c.id === Number(id));
    const teamMember = client?.teams?.find((m) => m.id === teamId);
    setSelectedTeamMember(teamMember || null);
    console.log(teamMember);
    setSpocModal(true);
  };

  return (
    <div className="flex flex-col flex-1 gap-3">
      <SearchBox
        name="search_url"
        placeholder="Search Urls"
        buttonText="search"
        classname="w-full"
      />
      <ComponentCard title={`${name}`}>
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
                {url?.map((u, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {u.urls}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {getTeamMemberName(u.assigned_to)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 space-x-2">
                      <Button
                        size="xs"
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleSpoc(u.assigned_to)}
                        className="border-yellow-500 text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                      >
                        SPOC
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        className="border-pink-500 text-pink-500 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                      >
                        Send Assessment
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Modal isOpen={spocModal} onClose={() => setSpocModal(false)}>
              <Spoc team={selectedTeamMember} />
            </Modal>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

export default TestingEnvironment;
