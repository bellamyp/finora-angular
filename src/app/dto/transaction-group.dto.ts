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
  bankName?: string;
  typeName?: string;
}

export interface TransactionGroupDto {
  id: string;
  transactions: TransactionResponseDto[];
}
