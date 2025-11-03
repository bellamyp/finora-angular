import {TransactionTypeEnum} from './transaction-type.enum';

export interface TransactionDto {
  id: string; // UUID
  date: string;
  amount: number;
  type: TransactionTypeEnum;    // use enum instead of string
  notes?: string;               // make optional if backend can return null
  bankName?: string;            // optional if no bank linked
  userEmail: string;
}
