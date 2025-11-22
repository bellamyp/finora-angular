
export interface BankCreateDto {
  name: string;
  openingDate: string;  // YYYY-MM-DD
  closingDate?: string | null;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'REWARDS';
}
