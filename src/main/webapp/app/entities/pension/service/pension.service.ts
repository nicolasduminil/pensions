import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPension, getPensionIdentifier } from '../pension.model';

export type EntityResponseType = HttpResponse<IPension>;
export type EntityArrayResponseType = HttpResponse<IPension[]>;

@Injectable({ providedIn: 'root' })
export class PensionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pensions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pension: IPension): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pension);
    return this.http
      .post<IPension>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(pension: IPension): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pension);
    return this.http
      .put<IPension>(`${this.resourceUrl}/${getPensionIdentifier(pension) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(pension: IPension): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pension);
    return this.http
      .patch<IPension>(`${this.resourceUrl}/${getPensionIdentifier(pension) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPension>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPension[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPensionToCollectionIfMissing(pensionCollection: IPension[], ...pensionsToCheck: (IPension | null | undefined)[]): IPension[] {
    const pensions: IPension[] = pensionsToCheck.filter(isPresent);
    if (pensions.length > 0) {
      const pensionCollectionIdentifiers = pensionCollection.map(pensionItem => getPensionIdentifier(pensionItem)!);
      const pensionsToAdd = pensions.filter(pensionItem => {
        const pensionIdentifier = getPensionIdentifier(pensionItem);
        if (pensionIdentifier == null || pensionCollectionIdentifiers.includes(pensionIdentifier)) {
          return false;
        }
        pensionCollectionIdentifiers.push(pensionIdentifier);
        return true;
      });
      return [...pensionsToAdd, ...pensionCollection];
    }
    return pensionCollection;
  }

  protected convertDateFromClient(pension: IPension): IPension {
    return Object.assign({}, pension, {
      startingDate: pension.startingDate?.isValid() ? pension.startingDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startingDate = res.body.startingDate ? dayjs(res.body.startingDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((pension: IPension) => {
        pension.startingDate = pension.startingDate ? dayjs(pension.startingDate) : undefined;
      });
    }
    return res;
  }
}
