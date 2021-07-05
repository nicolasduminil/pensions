import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPayment, Payment } from '../payment.model';
import { PaymentService } from '../service/payment.service';
import { IPension } from 'app/entities/pension/pension.model';
import { PensionService } from 'app/entities/pension/service/pension.service';
import { IRecipient } from 'app/entities/recipient/recipient.model';
import { RecipientService } from 'app/entities/recipient/service/recipient.service';

@Component({
  selector: 'jhi-payment-update',
  templateUrl: './payment-update.component.html',
})
export class PaymentUpdateComponent implements OnInit {
  isSaving = false;

  pensionsCollection: IPension[] = [];
  recipientsCollection: IRecipient[] = [];

  editForm = this.fb.group({
    id: [],
    paymentsStatus: [null, [Validators.required]],
    paymentDate: [null, [Validators.required]],
    pension: [],
    recipient: [],
  });

  constructor(
    protected paymentService: PaymentService,
    protected pensionService: PensionService,
    protected recipientService: RecipientService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payment }) => {
      this.updateForm(payment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const payment = this.createFromForm();
    if (payment.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentService.update(payment));
    } else {
      this.subscribeToSaveResponse(this.paymentService.create(payment));
    }
  }

  trackPensionById(index: number, item: IPension): number {
    return item.id!;
  }

  trackRecipientById(index: number, item: IRecipient): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayment>>): void {
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

  protected updateForm(payment: IPayment): void {
    this.editForm.patchValue({
      id: payment.id,
      paymentsStatus: payment.paymentsStatus,
      paymentDate: payment.paymentDate,
      pension: payment.pension,
      recipient: payment.recipient,
    });

    this.pensionsCollection = this.pensionService.addPensionToCollectionIfMissing(this.pensionsCollection, payment.pension);
    this.recipientsCollection = this.recipientService.addRecipientToCollectionIfMissing(this.recipientsCollection, payment.recipient);
  }

  protected loadRelationshipsOptions(): void {
    this.pensionService
      .query({ filter: 'payment-is-null' })
      .pipe(map((res: HttpResponse<IPension[]>) => res.body ?? []))
      .pipe(
        map((pensions: IPension[]) => this.pensionService.addPensionToCollectionIfMissing(pensions, this.editForm.get('pension')!.value))
      )
      .subscribe((pensions: IPension[]) => (this.pensionsCollection = pensions));

    this.recipientService
      .query({ filter: 'payment-is-null' })
      .pipe(map((res: HttpResponse<IRecipient[]>) => res.body ?? []))
      .pipe(
        map((recipients: IRecipient[]) =>
          this.recipientService.addRecipientToCollectionIfMissing(recipients, this.editForm.get('recipient')!.value)
        )
      )
      .subscribe((recipients: IRecipient[]) => (this.recipientsCollection = recipients));
  }

  protected createFromForm(): IPayment {
    return {
      ...new Payment(),
      id: this.editForm.get(['id'])!.value,
      paymentsStatus: this.editForm.get(['paymentsStatus'])!.value,
      paymentDate: this.editForm.get(['paymentDate'])!.value,
      pension: this.editForm.get(['pension'])!.value,
      recipient: this.editForm.get(['recipient'])!.value,
    };
  }
}
