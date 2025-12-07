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
    company?: number;
    company_id?: number;
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