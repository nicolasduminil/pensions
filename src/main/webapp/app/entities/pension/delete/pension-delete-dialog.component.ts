import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPension } from '../pension.model';
import { PensionService } from '../service/pension.service';

@Component({
  templateUrl: './pension-delete-dialog.component.html',
})
export class PensionDeleteDialogComponent {
  pension?: IPension;

  constructor(protected pensionService: PensionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pensionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
