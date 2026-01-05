
export interface BankEditDto {
  id?: string;               // Optional: present only for update
  name: string;
  openingDate: string;       // YYYY-MM-DD
  closingDate?: string | null;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'REWARDS';
  groupId: string;
}
