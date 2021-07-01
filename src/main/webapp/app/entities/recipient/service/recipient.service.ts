import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRecipient, getRecipientIdentifier } from '../recipient.model';

export type EntityResponseType = HttpResponse<IRecipient>;
export type EntityArrayResponseType = HttpResponse<IRecipient[]>;

@Injectable({ providedIn: 'root' })
export class RecipientService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/recipients');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(recipient: IRecipient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recipient);
    return this.http
      .post<IRecipient>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(recipient: IRecipient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recipient);
    return this.http
      .put<IRecipient>(`${this.resourceUrl}/${getRecipientIdentifier(recipient) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(recipient: IRecipient): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recipient);
    return this.http
      .patch<IRecipient>(`${this.resourceUrl}/${getRecipientIdentifier(recipient) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRecipient>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRecipient[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRecipientToCollectionIfMissing(
    recipientCollection: IRecipient[],
    ...recipientsToCheck: (IRecipient | null | undefined)[]
  ): IRecipient[] {
    const recipients: IRecipient[] = recipientsToCheck.filter(isPresent);
    if (recipients.length > 0) {
      const recipientCollectionIdentifiers = recipientCollection.map(recipientItem => getRecipientIdentifier(recipientItem)!);
      const recipientsToAdd = recipients.filter(recipientItem => {
        const recipientIdentifier = getRecipientIdentifier(recipientItem);
        if (recipientIdentifier == null || recipientCollectionIdentifiers.includes(recipientIdentifier)) {
          return false;
        }
        recipientCollectionIdentifiers.push(recipientIdentifier);
        return true;
      });
      return [...recipientsToAdd, ...recipientCollection];
    }
    return recipientCollection;
  }

  protected convertDateFromClient(recipient: IRecipient): IRecipient {
    return Object.assign({}, recipient, {
      birthDate: recipient.birthDate?.isValid() ? recipient.birthDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.birthDate = res.body.birthDate ? dayjs(res.body.birthDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((recipient: IRecipient) => {
        recipient.birthDate = recipient.birthDate ? dayjs(recipient.birthDate) : undefined;
      });
    }
    return res;
  }
}
