// transaction-group.dto.ts
export interface TransactionResponseDto {
  id: string;
  date: string;
  amount: number;
  notes: string;
  bankId: string;
  brandId: string;
  typeId: string;

  // OPTIONAL fields
  groupId?: string;
  bankName?: string;
  brandName?: string;
  posted: boolean;
}

export interface TransactionGroupDto {
  id?: string;
  transactions: TransactionResponseDto[];
}
