import {TransactionTypeEnum} from './transaction-type.enum';

export interface TransactionCreateDto {
  date: string;                 // ISO format
  amount: number;
  type: TransactionTypeEnum;    // use enum instead of string
  notes?: string;
  bankId?: string; // UUID
  userEmail: string;
}
