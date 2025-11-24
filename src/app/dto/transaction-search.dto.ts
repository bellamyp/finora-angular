
export interface TransactionSearchDto {
  startDate?: string | null;
  endDate?: string | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  bankId?: string | null;
  brandId?: string | null;
  typeId?: string | null;
  keyword?: string | null;
}
