export interface Compliance {
  id: number;
  name: string;
}

export interface ComplianceType {
  count: number;
  next: string | null;
  previous: string | null;
  results: Compliance[];
}

export interface Assessment {
  id: number;
  name: string;
}

export interface AssessmentType {
  count: number;
  next: string | null;
  previous: string | null;
  results: Assessment[];
}

export interface Vulnerability {
    id: number;
    name: string;
    description?: string;
    impact?: string;
    remediations?: string;
    reference?: string;
    cvss?: string;
    category_of_testing: Assessment
    category_of_testing_id?: number;
}

export interface VulnerabilityType {
  count: number;
  next: string | null;
  previous: string | null;
  results: Vulnerability[];
}

