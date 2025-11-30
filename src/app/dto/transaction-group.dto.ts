// transaction-group.dto.ts
export interface TransactionResponseDto {
  id: string;
  groupId?: string;
  date: string;
  amount: number | null;
  notes: string;
  bankId: string;
  bankName?: string;
  brandId: string;
  brandName?: string;
  locationId: string;
  locationName?: string;
  typeId: string;
  posted: boolean;
}

export interface TransactionGroupDto {
  id?: string;
  reportId?: string;
  transactions: TransactionResponseDto[];
}
