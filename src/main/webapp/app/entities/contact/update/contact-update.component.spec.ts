jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ContactService } from '../service/contact.service';
import { IContact, Contact } from '../contact.model';
import { IRecipient } from 'app/entities/recipient/recipient.model';
import { RecipientService } from 'app/entities/recipient/service/recipient.service';

import { ContactUpdateComponent } from './contact-update.component';

describe('Component Tests', () => {
  describe('Contact Management Update Component', () => {
    let comp: ContactUpdateComponent;
    let fixture: ComponentFixture<ContactUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let contactService: ContactService;
    let recipientService: RecipientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ContactUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ContactUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ContactUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      contactService = TestBed.inject(ContactService);
      recipientService = TestBed.inject(RecipientService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Recipient query and add missing value', () => {
        const contact: IContact = { id: 456 };
        const recipient: IRecipient = { id: 70595 };
        contact.recipient = recipient;

        const recipientCollection: IRecipient[] = [{ id: 49468 }];
        jest.spyOn(recipientService, 'query').mockReturnValue(of(new HttpResponse({ body: recipientCollection })));
        const additionalRecipients = [recipient];
        const expectedCollection: IRecipient[] = [...additionalRecipients, ...recipientCollection];
        jest.spyOn(recipientService, 'addRecipientToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ contact });
        comp.ngOnInit();

        expect(recipientService.query).toHaveBeenCalled();
        expect(recipientService.addRecipientToCollectionIfMissing).toHaveBeenCalledWith(recipientCollection, ...additionalRecipients);
        expect(comp.recipientsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const contact: IContact = { id: 456 };
        const recipient: IRecipient = { id: 93360 };
        contact.recipient = recipient;

        activatedRoute.data = of({ contact });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(contact));
        expect(comp.recipientsSharedCollection).toContain(recipient);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Contact>>();
        const contact = { id: 123 };
        jest.spyOn(contactService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ contact });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: contact }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(contactService.update).toHaveBeenCalledWith(contact);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Contact>>();
        const contact = new Contact();
        jest.spyOn(contactService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ contact });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: contact }));
        saveSubject.complete();

        // THEN
        expect(contactService.create).toHaveBeenCalledWith(contact);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Contact>>();
        const contact = { id: 123 };
        jest.spyOn(contactService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ contact });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(contactService.update).toHaveBeenCalledWith(contact);
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
