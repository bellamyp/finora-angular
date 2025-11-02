export interface BankDto {
  id: number;
  name: string;
  type: string;   // <-- matches "type" from BE
  email: string;  // <-- matches "email" from BE
}
