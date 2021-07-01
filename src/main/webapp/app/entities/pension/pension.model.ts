import * as dayjs from 'dayjs';
import { IRecipient } from 'app/entities/recipient/recipient.model';
import { PensionType } from 'app/entities/enumerations/pension-type.model';
import { PaymentMethod } from 'app/entities/enumerations/payment-method.model';

export interface IPension {
  id?: number;
  pensionType?: PensionType;
  startingDate?: dayjs.Dayjs;
  paymentMethod?: PaymentMethod;
  amount?: number;
  recipient?: IRecipient | null;
}

export class Pension implements IPension {
  constructor(
    public id?: number,
    public pensionType?: PensionType,
    public startingDate?: dayjs.Dayjs,
    public paymentMethod?: PaymentMethod,
    public amount?: number,
    public recipient?: IRecipient | null
  ) {}
}

export function getPensionIdentifier(pension: IPension): number | undefined {
  return pension.id;
}