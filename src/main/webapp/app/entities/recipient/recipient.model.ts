import * as dayjs from 'dayjs';
import { IAddress } from 'app/entities/address/address.model';
import { IContact } from 'app/entities/contact/contact.model';
import { IPension } from 'app/entities/pension/pension.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface IRecipient {
  id?: number;
  firstName?: string;
  lastName?: string;
  birthDate?: dayjs.Dayjs;
  gender?: Gender;
  addresses?: IAddress[] | null;
  contacts?: IContact[] | null;
  pension?: IPension | null;
}

export class Recipient implements IRecipient {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public birthDate?: dayjs.Dayjs,
    public gender?: Gender,
    public addresses?: IAddress[] | null,
    public contacts?: IContact[] | null,
    public pension?: IPension | null
  ) {}
}

export function getRecipientIdentifier(recipient: IRecipient): number | undefined {
  return recipient.id;
}
