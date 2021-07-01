jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AddressService } from '../service/address.service';
import { IAddress, Address } from '../address.model';
import { IRecipient } from 'app/entities/recipient/recipient.model';
import { RecipientService } from 'app/entities/recipient/service/recipient.service';

import { AddressUpdateComponent } from './address-update.component';

describe('Component Tests', () => {
  describe('Address Management Update Component', () => {
    let comp: AddressUpdateComponent;
    let fixture: ComponentFixture<AddressUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let addressService: AddressService;
    let recipientService: RecipientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AddressUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AddressUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AddressUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      addressService = TestBed.inject(AddressService);
      recipientService = TestBed.inject(RecipientService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Recipient query and add missing value', () => {
        const address: IAddress = { id: 456 };
        const recipient: IRecipient = { id: 3125 };
        address.recipient = recipient;

        const recipientCollection: IRecipient[] = [{ id: 35265 }];
        jest.spyOn(recipientService, 'query').mockReturnValue(of(new HttpResponse({ body: recipientCollection })));
        const additionalRecipients = [recipient];
        const expectedCollection: IRecipient[] = [...additionalRecipients, ...recipientCollection];
        jest.spyOn(recipientService, 'addRecipientToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ address });
        comp.ngOnInit();

        expect(recipientService.query).toHaveBeenCalled();
        expect(recipientService.addRecipientToCollectionIfMissing).toHaveBeenCalledWith(recipientCollection, ...additionalRecipients);
        expect(comp.recipientsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const address: IAddress = { id: 456 };
        const recipient: IRecipient = { id: 19776 };
        address.recipient = recipient;

        activatedRoute.data = of({ address });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(address));
        expect(comp.recipientsSharedCollection).toContain(recipient);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Address>>();
        const address = { id: 123 };
        jest.spyOn(addressService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ address });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: address }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(addressService.update).toHaveBeenCalledWith(address);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Address>>();
        const address = new Address();
        jest.spyOn(addressService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ address });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: address }));
        saveSubject.complete();

        // THEN
        expect(addressService.create).toHaveBeenCalledWith(address);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Address>>();
        const address = { id: 123 };
        jest.spyOn(addressService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ address });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(addressService.update).toHaveBeenCalledWith(address);
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
