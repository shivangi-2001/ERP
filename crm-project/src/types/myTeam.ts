export interface Team {
  id: number;
  team_name: string;
}

export interface TeamType {
  count: number;
  next: string | null;
  previous: string | null;
  results: Team[];
}

export interface Employee {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  contact_number: string;
  password?: string;
  designation: string;
  team?: Team;
  team_id?: number;
  is_active: boolean;
  is_staff?: boolean;
  date_joined: string;
}

export interface EmployeeType {
  count: number;
  next: string | null;
  previous: string | null;
  results: Employee[];
}
