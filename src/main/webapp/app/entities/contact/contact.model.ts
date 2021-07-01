import { IRecipient } from 'app/entities/recipient/recipient.model';

export interface IContact {
  id?: number;
  email?: string;
  phone?: string;
  recipient?: IRecipient | null;
}

export class Contact implements IContact {
  constructor(public id?: number, public email?: string, public phone?: string, public recipient?: IRecipient | null) {}
}

export function getContactIdentifier(contact: IContact): number | undefined {
  return contact.id;
}
