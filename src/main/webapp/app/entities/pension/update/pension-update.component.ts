import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPension, Pension } from '../pension.model';
import { PensionService } from '../service/pension.service';
import { IRecipient } from 'app/entities/recipient/recipient.model';
import { RecipientService } from 'app/entities/recipient/service/recipient.service';

@Component({
  selector: 'jhi-pension-update',
  templateUrl: './pension-update.component.html',
})
export class PensionUpdateComponent implements OnInit {
  isSaving = false;

  recipientsCollection: IRecipient[] = [];

  editForm = this.fb.group({
    id: [],
    pensionType: [null, [Validators.required]],
    startingDate: [null, [Validators.required]],
    paymentMethod: [null, [Validators.required]],
    amount: [null, [Validators.required]],
    recipient: [],
  });

  constructor(
    protected pensionService: PensionService,
    protected recipientService: RecipientService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pension }) => {
      this.updateForm(pension);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pension = this.createFromForm();
    if (pension.id !== undefined) {
      this.subscribeToSaveResponse(this.pensionService.update(pension));
    } else {
      this.subscribeToSaveResponse(this.pensionService.create(pension));
    }
  }

  trackRecipientById(index: number, item: IRecipient): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPension>>): void {
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

  protected updateForm(pension: IPension): void {
    this.editForm.patchValue({
      id: pension.id,
      pensionType: pension.pensionType,
      startingDate: pension.startingDate,
      paymentMethod: pension.paymentMethod,
      amount: pension.amount,
      recipient: pension.recipient,
    });

    this.recipientsCollection = this.recipientService.addRecipientToCollectionIfMissing(this.recipientsCollection, pension.recipient);
  }

  protected loadRelationshipsOptions(): void {
    this.recipientService
      .query({ filter: 'pension-is-null' })
      .pipe(map((res: HttpResponse<IRecipient[]>) => res.body ?? []))
      .pipe(
        map((recipients: IRecipient[]) =>
          this.recipientService.addRecipientToCollectionIfMissing(recipients, this.editForm.get('recipient')!.value)
        )
      )
      .subscribe((recipients: IRecipient[]) => (this.recipientsCollection = recipients));
  }

  protected createFromForm(): IPension {
    return {
      ...new Pension(),
      id: this.editForm.get(['id'])!.value,
      pensionType: this.editForm.get(['pensionType'])!.value,
      startingDate: this.editForm.get(['startingDate'])!.value,
      paymentMethod: this.editForm.get(['paymentMethod'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      recipient: this.editForm.get(['recipient'])!.value,
    };
  }
}
