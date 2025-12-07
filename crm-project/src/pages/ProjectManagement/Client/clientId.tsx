import { useParams } from "react-router";
import PageMeta from "../common/PageMeta";
import React from "react";
import ClientForm from "../ClientID/ClientForm";
import ClientTeamAdd from "../ClientTeam/add";
import ClientTeamTable from "../ClientTeam/view";


interface Teams {
  id: number;
  name: string;
  email: string;
  contact: number;
  role: string;
}

interface ClientDetail {
  id: number;
  company_name: string;
  company_email: string;
  company_contact: number;
  image?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  teams: Teams[];
}

const tableData: ClientDetail[] = [
  {
    id: 1,
    company_name: "DarkVault Inc.",
    company_email: "contact@darkvault.net",
    company_contact: 9999876543,
    image: "images/user/user-01.jpg",
    address: "123 Shadow Lane, Dark City",
    city: "Dark City",
    state: "Dark State",
    zip: "123456",
    country: "Darkland",
    teams: [
      {
        id: 1,
        name: "Victor Black",
        email: "victor@darkvault.net",
        contact: 9991112222,
        role: "Security Analyst",
      },
      {
        id: 2,
        name: "Luna Knight",
        email: "luna@darkvault.net",
        contact: 9993334444,
        role: "Red Team Lead",
      },
    ],
  },
  {
    id: 2,
    company_name: "GhostProxy Ltd.",
    company_email: "support@ghostproxy.org",
    company_contact: 8881112222,
    image: "images/user/user-02.jpg",
    address: "456 Fog Street, Ghost Town",
    city: "Ghost Town",
    state: "Mist State",
    zip: "654321",
    country: "Ghostland",
    teams: [
      {
        id: 3,
        name: "Anna Crypt",
        email: "anna@ghostproxy.org",
        contact: 8885556666,
        role: "Infrastructure Engineer",
      },
    ],
  },
  {
    id: 3,
    company_name: "RedSector Labs",
    company_email: "admin@redsector.io",
    company_contact: 7771122334,
    image: "images/user/user-03.jpg",
    address: "789 Crimson Rd, Sector 9",
    city: "Crimson City",
    state: "Redline",
    zip: "789101",
    country: "Redland",
    teams: [
      {
        id: 4,
        name: "Elias Rogue",
        email: "elias@redsector.io",
        contact: 7774445555,
        role: "Pentester",
      },
      {
        id: 5,
        name: "Nina Trace",
        email: "nina@redsector.io",
        contact: 7776667777,
        role: "Cybersecurity Consultant",
      },
    ],
  },
  {
    id: 4,
    company_name: "ByteTrap Solutions",
    company_email: "info@bytetrap.com",
    company_contact: 6669988776,
    image: "images/user/user-04.jpg",
    address: "321 Code Ave, Trapville",
    city: "Trapville",
    state: "CodeState",
    zip: "112233",
    country: "Byteland",
    teams: [
      {
        id: 6,
        name: "Nadia Byte",
        email: "nadia@bytetrap.com",
        contact: 6662223333,
        role: "CTO",
      },
    ],
  },
  {
    id: 5,
    company_name: "NullSector Corp.",
    company_email: "security@nullsector.net",
    company_contact: 5557788990,
    image: "images/user/user-05.jpg",
    address: "404 Null St, Sector Zero",
    city: "Zero City",
    state: "Void",
    zip: "000000",
    country: "Nulland",
    teams: [
      {
        id: 7,
        name: "Rick Phantom",
        email: "rick@nullsector.net",
        contact: 5551112222,
        role: "Incident Responder",
      },
      {
        id: 8,
        name: "Claire Fade",
        email: "claire@nullsector.net",
        contact: 5553334444,
        role: "Threat Hunter",
      },
    ],
  },
];

const ClientID: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const client = tableData.find((client) => client.id.toString() === id);

  console.log(client)
  return (
    <>
      <PageMeta title="Client Details" description="" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
            <ClientForm client={client} />
        </div>
        <div className="space-y-6">
            <ClientTeamAdd />
            <ClientTeamTable teams={client?.teams}/>
        </div>
      </div>
    </>
  );
};

export default ClientID;
