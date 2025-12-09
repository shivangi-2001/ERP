import { Compliance, Vulnerability } from "./assessment";
import { Employee } from "./myTeam";

export interface ClientAddress{
    address: string;
    city: string;
    state: string;
    postal_code: number;
    country: string;
}

export interface ClientTeam{
    id?: number;
    name: string;
    email: string;
    mobile_code: string;
    mobile: string;
    designation?: string;
    client?: number;
}

export interface ClientDetail {
  id?: number;
  name: string;
  email: string;
  phone_code: string;
  phone: string;
  profile?: string;
  date_joined?: string;
  address?: ClientAddress;
  teams?: ClientTeam[]
}

export interface ClientDetails {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClientDetail[];
}

export interface ClientAssessment{
  id: number,
  client?: number,
  client_name?: string,
  client_id?: number,
  assessment_type: number,
  assessment_type_name?: string
}

export interface ClientAssessmentType {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClientAssessment[];
}


export interface UrlMapping {
  id: number;
  start_date: string;
  end_date: string;
  qa_date: string;
  url: string;
  tester?: Employee;
  tester_id?: number;
  client_assessment?: ClientAssessment;
  client_assessment_id?: number;
  compliance?: Compliance;
  compliance_id?: number;
  is_completed: boolean;
}

export interface UrlMappingType {
  count: number;
  next: string | null;
  previous: string | null;
  results: UrlMapping[];
}

export interface Finding {
  id: number;
  url?: UrlMapping,
  vulnerability?: Vulnerability,
  url_id?: number,
  vulnerability_id?: number
}

export interface FindingType {
  count: number;
  next: string | null;
  previous: string | null;
  results: Finding[];
}