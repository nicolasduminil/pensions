import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAddress, Address } from '../address.model';
import { AddressService } from '../service/address.service';
import { IRecipient } from 'app/entities/recipient/recipient.model';
import { RecipientService } from 'app/entities/recipient/service/recipient.service';

@Component({
  selector: 'jhi-address-update',
  templateUrl: './address-update.component.html',
})
export class AddressUpdateComponent implements OnInit {
  isSaving = false;

  recipientsSharedCollection: IRecipient[] = [];

  editForm = this.fb.group({
    id: [],
    addressLine1: [null, [Validators.required]],
    addressLine2: [],
    city: [null, [Validators.required]],
    country: [null, [Validators.required]],
    recipient: [],
  });

  constructor(
    protected addressService: AddressService,
    protected recipientService: RecipientService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ address }) => {
      this.updateForm(address);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const address = this.createFromForm();
    if (address.id !== undefined) {
      this.subscribeToSaveResponse(this.addressService.update(address));
    } else {
      this.subscribeToSaveResponse(this.addressService.create(address));
    }
  }

  trackRecipientById(index: number, item: IRecipient): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAddress>>): void {
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

  protected updateForm(address: IAddress): void {
    this.editForm.patchValue({
      id: address.id,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      country: address.country,
      recipient: address.recipient,
    });

    this.recipientsSharedCollection = this.recipientService.addRecipientToCollectionIfMissing(
      this.recipientsSharedCollection,
      address.recipient
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

  protected createFromForm(): IAddress {
    return {
      ...new Address(),
      id: this.editForm.get(['id'])!.value,
      addressLine1: this.editForm.get(['addressLine1'])!.value,
      addressLine2: this.editForm.get(['addressLine2'])!.value,
      city: this.editForm.get(['city'])!.value,
      country: this.editForm.get(['country'])!.value,
      recipient: this.editForm.get(['recipient'])!.value,
    };
  }
}
