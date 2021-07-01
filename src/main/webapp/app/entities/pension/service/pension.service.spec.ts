import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { PensionType } from 'app/entities/enumerations/pension-type.model';
import { PaymentMethod } from 'app/entities/enumerations/payment-method.model';
import { IPension, Pension } from '../pension.model';

import { PensionService } from './pension.service';

describe('Service Tests', () => {
  describe('Pension Service', () => {
    let service: PensionService;
    let httpMock: HttpTestingController;
    let elemDefault: IPension;
    let expectedResult: IPension | IPension[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PensionService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        pensionType: PensionType.TYPE1,
        startingDate: currentDate,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        amount: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            startingDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Pension', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            startingDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startingDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Pension()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Pension', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            pensionType: 'BBBBBB',
            startingDate: currentDate.format(DATE_FORMAT),
            paymentMethod: 'BBBBBB',
            amount: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startingDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Pension', () => {
        const patchObject = Object.assign(
          {
            paymentMethod: 'BBBBBB',
            amount: 1,
          },
          new Pension()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            startingDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Pension', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            pensionType: 'BBBBBB',
            startingDate: currentDate.format(DATE_FORMAT),
            paymentMethod: 'BBBBBB',
            amount: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startingDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Pension', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPensionToCollectionIfMissing', () => {
        it('should add a Pension to an empty array', () => {
          const pension: IPension = { id: 123 };
          expectedResult = service.addPensionToCollectionIfMissing([], pension);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(pension);
        });

        it('should not add a Pension to an array that contains it', () => {
          const pension: IPension = { id: 123 };
          const pensionCollection: IPension[] = [
            {
              ...pension,
            },
            { id: 456 },
          ];
          expectedResult = service.addPensionToCollectionIfMissing(pensionCollection, pension);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Pension to an array that doesn't contain it", () => {
          const pension: IPension = { id: 123 };
          const pensionCollection: IPension[] = [{ id: 456 }];
          expectedResult = service.addPensionToCollectionIfMissing(pensionCollection, pension);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(pension);
        });

        it('should add only unique Pension to an array', () => {
          const pensionArray: IPension[] = [{ id: 123 }, { id: 456 }, { id: 97619 }];
          const pensionCollection: IPension[] = [{ id: 123 }];
          expectedResult = service.addPensionToCollectionIfMissing(pensionCollection, ...pensionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const pension: IPension = { id: 123 };
          const pension2: IPension = { id: 456 };
          expectedResult = service.addPensionToCollectionIfMissing([], pension, pension2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(pension);
          expect(expectedResult).toContain(pension2);
        });

        it('should accept null and undefined values', () => {
          const pension: IPension = { id: 123 };
          expectedResult = service.addPensionToCollectionIfMissing([], null, pension, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(pension);
        });

        it('should return initial array if no Pension is added', () => {
          const pensionCollection: IPension[] = [{ id: 123 }];
          expectedResult = service.addPensionToCollectionIfMissing(pensionCollection, undefined, null);
          expect(expectedResult).toEqual(pensionCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
