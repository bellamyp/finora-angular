// transaction-group.dto.ts
export interface TransactionResponseDto {
  id: string;
  groupId?: string;
  date: string;
  amount: number;
  notes: string;
  bankId: string;
  brandId: string;
  locationId: string;
  typeId: string;

  // OPTIONAL fields
  bankName?: string;
  brandName?: string;
  posted: boolean;
}

export interface TransactionGroupDto {
  id?: string;
  transactions: TransactionResponseDto[];
}
