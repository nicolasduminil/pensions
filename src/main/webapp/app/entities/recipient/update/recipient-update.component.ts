import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRecipient, Recipient } from '../recipient.model';
import { RecipientService } from '../service/recipient.service';

@Component({
  selector: 'jhi-recipient-update',
  templateUrl: './recipient-update.component.html',
})
export class RecipientUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    birthDate: [null, [Validators.required]],
    gender: [null, [Validators.required]],
  });

  constructor(protected recipientService: RecipientService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recipient }) => {
      this.updateForm(recipient);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const recipient = this.createFromForm();
    if (recipient.id !== undefined) {
      this.subscribeToSaveResponse(this.recipientService.update(recipient));
    } else {
      this.subscribeToSaveResponse(this.recipientService.create(recipient));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecipient>>): void {
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

  protected updateForm(recipient: IRecipient): void {
    this.editForm.patchValue({
      id: recipient.id,
      firstName: recipient.firstName,
      lastName: recipient.lastName,
      birthDate: recipient.birthDate,
      gender: recipient.gender,
    });
  }

  protected createFromForm(): IRecipient {
    return {
      ...new Recipient(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      birthDate: this.editForm.get(['birthDate'])!.value,
      gender: this.editForm.get(['gender'])!.value,
    };
  }
}
