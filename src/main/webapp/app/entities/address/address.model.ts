import { IRecipient } from 'app/entities/recipient/recipient.model';

export interface IAddress {
  id?: number;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  country?: string;
  recipient?: IRecipient | null;
}

export class Address implements IAddress {
  constructor(
    public id?: number,
    public addressLine1?: string,
    public addressLine2?: string | null,
    public city?: string,
    public country?: string,
    public recipient?: IRecipient | null
  ) {}
}

export function getAddressIdentifier(address: IAddress): number | undefined {
  return address.id;
}
