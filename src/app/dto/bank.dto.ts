
export interface BankDto {
  id: string;
  groupId: string;
  name: string;
  type: string;
  email: string;
  pendingBalance?: number;
  postedBalance?: number;
}
