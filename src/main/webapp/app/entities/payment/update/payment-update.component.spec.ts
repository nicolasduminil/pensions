jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PaymentService } from '../service/payment.service';
import { IPayment, Payment } from '../payment.model';
import { IPension } from 'app/entities/pension/pension.model';
import { PensionService } from 'app/entities/pension/service/pension.service';
import { IRecipient } from 'app/entities/recipient/recipient.model';
import { RecipientService } from 'app/entities/recipient/service/recipient.service';

import { PaymentUpdateComponent } from './payment-update.component';

describe('Component Tests', () => {
  describe('Payment Management Update Component', () => {
    let comp: PaymentUpdateComponent;
    let fixture: ComponentFixture<PaymentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let paymentService: PaymentService;
    let pensionService: PensionService;
    let recipientService: RecipientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PaymentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PaymentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PaymentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      paymentService = TestBed.inject(PaymentService);
      pensionService = TestBed.inject(PensionService);
      recipientService = TestBed.inject(RecipientService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call pension query and add missing value', () => {
        const payment: IPayment = { id: 456 };
        const pension: IPension = { id: 93374 };
        payment.pension = pension;

        const pensionCollection: IPension[] = [{ id: 35892 }];
        jest.spyOn(pensionService, 'query').mockReturnValue(of(new HttpResponse({ body: pensionCollection })));
        const expectedCollection: IPension[] = [pension, ...pensionCollection];
        jest.spyOn(pensionService, 'addPensionToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ payment });
        comp.ngOnInit();

        expect(pensionService.query).toHaveBeenCalled();
        expect(pensionService.addPensionToCollectionIfMissing).toHaveBeenCalledWith(pensionCollection, pension);
        expect(comp.pensionsCollection).toEqual(expectedCollection);
      });

      it('Should call recipient query and add missing value', () => {
        const payment: IPayment = { id: 456 };
        const recipient: IRecipient = { id: 69146 };
        payment.recipient = recipient;

        const recipientCollection: IRecipient[] = [{ id: 41259 }];
        jest.spyOn(recipientService, 'query').mockReturnValue(of(new HttpResponse({ body: recipientCollection })));
        const expectedCollection: IRecipient[] = [recipient, ...recipientCollection];
        jest.spyOn(recipientService, 'addRecipientToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ payment });
        comp.ngOnInit();

        expect(recipientService.query).toHaveBeenCalled();
        expect(recipientService.addRecipientToCollectionIfMissing).toHaveBeenCalledWith(recipientCollection, recipient);
        expect(comp.recipientsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const payment: IPayment = { id: 456 };
        const pension: IPension = { id: 63560 };
        payment.pension = pension;
        const recipient: IRecipient = { id: 44604 };
        payment.recipient = recipient;

        activatedRoute.data = of({ payment });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(payment));
        expect(comp.pensionsCollection).toContain(pension);
        expect(comp.recipientsCollection).toContain(recipient);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Payment>>();
        const payment = { id: 123 };
        jest.spyOn(paymentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ payment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: payment }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(paymentService.update).toHaveBeenCalledWith(payment);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Payment>>();
        const payment = new Payment();
        jest.spyOn(paymentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ payment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: payment }));
        saveSubject.complete();

        // THEN
        expect(paymentService.create).toHaveBeenCalledWith(payment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Payment>>();
        const payment = { id: 123 };
        jest.spyOn(paymentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ payment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(paymentService.update).toHaveBeenCalledWith(payment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPensionById', () => {
        it('Should return tracked Pension primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPensionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackRecipientById', () => {
        it('Should return tracked Recipient primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRecipientById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
