// Customer API types
export interface Customer {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role: string;
}

export interface CustomerAuthResponse {
  user: Customer;
  token: string;
}