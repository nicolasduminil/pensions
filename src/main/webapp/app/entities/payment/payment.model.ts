import * as dayjs from 'dayjs';
import { IPension } from 'app/entities/pension/pension.model';
import { IRecipient } from 'app/entities/recipient/recipient.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';

export interface IPayment {
  id?: number;
  paymentsStatus?: PaymentStatus;
  paymentDate?: dayjs.Dayjs;
  pension?: IPension | null;
  recipient?: IRecipient | null;
}

export class Payment implements IPayment {
  constructor(
    public id?: number,
    public paymentsStatus?: PaymentStatus,
    public paymentDate?: dayjs.Dayjs,
    public pension?: IPension | null,
    public recipient?: IRecipient | null
  ) {}
}

export function getPaymentIdentifier(payment: IPayment): number | undefined {
  return payment.id;
}
