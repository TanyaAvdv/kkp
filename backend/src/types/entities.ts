export interface Contact {
  contact_id: number;
  name: string;
  surname: string;
  father_name: string;
  document: string;
  telephone: string;
  email: string;
  country: string;
  city: string;
  postal_code: string;
  street: string;
  placement_num: string;
  notes?: string;
}

export interface Client {
  client_id: number;
  typeofClient: 'tenant' | 'renter';
  contact_id?: number;
  contact?: Contact;
}

export interface Agent {
  agent_id: number;
  agent_rating: string;
  post_name: string;
  salary: number;
  currency: string;
  hiring_date: Date;
  dismissal_date?: Date;
  department_name: string;
  contact_id?: number;
  contact?: Contact;
}

export interface Estate {
  estate_id: number;
  estate_name: string;
  estate_status: string;
  estate_type: string;
  square: number;
  price: number;
  currency: string;
  country: string;
  city: string;
  postal_code: string;
  street: string;
  placement_num: string;
  estate_rating: string;
  notes?: string;
  agent_id?: number;
  tenant_id?: number;
  agent?: Agent;
  tenant?: Client;
}

export interface Contract {
  contract_id: number;
  contract_name: string;
  contract_status: string;
  signing_date: Date;
  validity_period: Date;
  notes?: string;
  estate_id?: number;
  agent_id?: number;
  tenant_id?: number;
  renter_id?: number;
  estate?: Estate;
  agent?: Agent;
  tenant?: Client;
  renter?: Client;
}

export interface Request {
  request_id: number;
  request_name: string;
  request_date: Date;
  request_type: string;
  square: number;
  price: number;
  currency: string;
  country: string;
  city: string;
  rental_period_months?: number;
  notes?: string;
  client_id?: number;
  client?: Client;
}

export interface Offer {
  offer_id: number;
  offer_name: string;
  offer_date: Date;
  offer_type: string;
  client_feedback?: string;
  notes?: string;
  client_id?: number;
  agent_id?: number;
  client?: Client;
  agent?: Agent;
}


