
export interface BankDto {
  id: string;
  name: string;
  type: string;   // <-- matches "type" from BE
  email: string;  // <-- matches "email" from BE
  balance?: number; // new field from BE
}
