
export interface BankDto {
  id: string; // UUID
  name: string;
  type: string;   // <-- matches "type" from BE
  email: string;  // <-- matches "email" from BE
}
