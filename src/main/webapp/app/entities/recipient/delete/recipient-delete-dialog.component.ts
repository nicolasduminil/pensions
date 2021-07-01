import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRecipient } from '../recipient.model';
import { RecipientService } from '../service/recipient.service';

@Component({
  templateUrl: './recipient-delete-dialog.component.html',
})
export class RecipientDeleteDialogComponent {
  recipient?: IRecipient;

  constructor(protected recipientService: RecipientService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.recipientService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
