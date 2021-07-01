import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { Gender } from 'app/entities/enumerations/gender.model';
import { IRecipient, Recipient } from '../recipient.model';

import { RecipientService } from './recipient.service';

describe('Service Tests', () => {
  describe('Recipient Service', () => {
    let service: RecipientService;
    let httpMock: HttpTestingController;
    let elemDefault: IRecipient;
    let expectedResult: IRecipient | IRecipient[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RecipientService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        firstName: 'AAAAAAA',
        lastName: 'AAAAAAA',
        birthDate: currentDate,
        gender: Gender.MALE,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            birthDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Recipient', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            birthDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            birthDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Recipient()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Recipient', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            birthDate: currentDate.format(DATE_FORMAT),
            gender: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            birthDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Recipient', () => {
        const patchObject = Object.assign(
          {
            birthDate: currentDate.format(DATE_FORMAT),
            gender: 'BBBBBB',
          },
          new Recipient()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            birthDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Recipient', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            birthDate: currentDate.format(DATE_FORMAT),
            gender: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            birthDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Recipient', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRecipientToCollectionIfMissing', () => {
        it('should add a Recipient to an empty array', () => {
          const recipient: IRecipient = { id: 123 };
          expectedResult = service.addRecipientToCollectionIfMissing([], recipient);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(recipient);
        });

        it('should not add a Recipient to an array that contains it', () => {
          const recipient: IRecipient = { id: 123 };
          const recipientCollection: IRecipient[] = [
            {
              ...recipient,
            },
            { id: 456 },
          ];
          expectedResult = service.addRecipientToCollectionIfMissing(recipientCollection, recipient);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Recipient to an array that doesn't contain it", () => {
          const recipient: IRecipient = { id: 123 };
          const recipientCollection: IRecipient[] = [{ id: 456 }];
          expectedResult = service.addRecipientToCollectionIfMissing(recipientCollection, recipient);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(recipient);
        });

        it('should add only unique Recipient to an array', () => {
          const recipientArray: IRecipient[] = [{ id: 123 }, { id: 456 }, { id: 88394 }];
          const recipientCollection: IRecipient[] = [{ id: 123 }];
          expectedResult = service.addRecipientToCollectionIfMissing(recipientCollection, ...recipientArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const recipient: IRecipient = { id: 123 };
          const recipient2: IRecipient = { id: 456 };
          expectedResult = service.addRecipientToCollectionIfMissing([], recipient, recipient2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(recipient);
          expect(expectedResult).toContain(recipient2);
        });

        it('should accept null and undefined values', () => {
          const recipient: IRecipient = { id: 123 };
          expectedResult = service.addRecipientToCollectionIfMissing([], null, recipient, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(recipient);
        });

        it('should return initial array if no Recipient is added', () => {
          const recipientCollection: IRecipient[] = [{ id: 123 }];
          expectedResult = service.addRecipientToCollectionIfMissing(recipientCollection, undefined, null);
          expect(expectedResult).toEqual(recipientCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
