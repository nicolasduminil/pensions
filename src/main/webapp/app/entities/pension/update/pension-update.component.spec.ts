jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PensionService } from '../service/pension.service';
import { IPension, Pension } from '../pension.model';
import { IRecipient } from 'app/entities/recipient/recipient.model';
import { RecipientService } from 'app/entities/recipient/service/recipient.service';

import { PensionUpdateComponent } from './pension-update.component';

describe('Component Tests', () => {
  describe('Pension Management Update Component', () => {
    let comp: PensionUpdateComponent;
    let fixture: ComponentFixture<PensionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let pensionService: PensionService;
    let recipientService: RecipientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PensionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PensionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PensionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      pensionService = TestBed.inject(PensionService);
      recipientService = TestBed.inject(RecipientService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call recipient query and add missing value', () => {
        const pension: IPension = { id: 456 };
        const recipient: IRecipient = { id: 1576 };
        pension.recipient = recipient;

        const recipientCollection: IRecipient[] = [{ id: 76216 }];
        jest.spyOn(recipientService, 'query').mockReturnValue(of(new HttpResponse({ body: recipientCollection })));
        const expectedCollection: IRecipient[] = [recipient, ...recipientCollection];
        jest.spyOn(recipientService, 'addRecipientToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ pension });
        comp.ngOnInit();

        expect(recipientService.query).toHaveBeenCalled();
        expect(recipientService.addRecipientToCollectionIfMissing).toHaveBeenCalledWith(recipientCollection, recipient);
        expect(comp.recipientsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const pension: IPension = { id: 456 };
        const recipient: IRecipient = { id: 7307 };
        pension.recipient = recipient;

        activatedRoute.data = of({ pension });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(pension));
        expect(comp.recipientsCollection).toContain(recipient);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Pension>>();
        const pension = { id: 123 };
        jest.spyOn(pensionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ pension });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pension }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(pensionService.update).toHaveBeenCalledWith(pension);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Pension>>();
        const pension = new Pension();
        jest.spyOn(pensionService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ pension });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pension }));
        saveSubject.complete();

        // THEN
        expect(pensionService.create).toHaveBeenCalledWith(pension);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Pension>>();
        const pension = { id: 123 };
        jest.spyOn(pensionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ pension });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(pensionService.update).toHaveBeenCalledWith(pension);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
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
