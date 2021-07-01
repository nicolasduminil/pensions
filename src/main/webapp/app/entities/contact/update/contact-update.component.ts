import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IContact, Contact } from '../contact.model';
import { ContactService } from '../service/contact.service';
import { IRecipient } from 'app/entities/recipient/recipient.model';
import { RecipientService } from 'app/entities/recipient/service/recipient.service';

@Component({
  selector: 'jhi-contact-update',
  templateUrl: './contact-update.component.html',
})
export class ContactUpdateComponent implements OnInit {
  isSaving = false;

  recipientsSharedCollection: IRecipient[] = [];

  editForm = this.fb.group({
    id: [],
    email: [null, [Validators.required, Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
    phone: [null, [Validators.required]],
    recipient: [],
  });

  constructor(
    protected contactService: ContactService,
    protected recipientService: RecipientService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contact }) => {
      this.updateForm(contact);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contact = this.createFromForm();
    if (contact.id !== undefined) {
      this.subscribeToSaveResponse(this.contactService.update(contact));
    } else {
      this.subscribeToSaveResponse(this.contactService.create(contact));
    }
  }

  trackRecipientById(index: number, item: IRecipient): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContact>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(contact: IContact): void {
    this.editForm.patchValue({
      id: contact.id,
      email: contact.email,
      phone: contact.phone,
      recipient: contact.recipient,
    });

    this.recipientsSharedCollection = this.recipientService.addRecipientToCollectionIfMissing(
      this.recipientsSharedCollection,
      contact.recipient
    );
  }

  protected loadRelationshipsOptions(): void {
    this.recipientService
      .query()
      .pipe(map((res: HttpResponse<IRecipient[]>) => res.body ?? []))
      .pipe(
        map((recipients: IRecipient[]) =>
          this.recipientService.addRecipientToCollectionIfMissing(recipients, this.editForm.get('recipient')!.value)
        )
      )
      .subscribe((recipients: IRecipient[]) => (this.recipientsSharedCollection = recipients));
  }

  protected createFromForm(): IContact {
    return {
      ...new Contact(),
      id: this.editForm.get(['id'])!.value,
      email: this.editForm.get(['email'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      recipient: this.editForm.get(['recipient'])!.value,
    };
  }
}
