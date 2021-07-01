import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RecipientComponent } from './list/recipient.component';
import { RecipientDetailComponent } from './detail/recipient-detail.component';
import { RecipientUpdateComponent } from './update/recipient-update.component';
import { RecipientDeleteDialogComponent } from './delete/recipient-delete-dialog.component';
import { RecipientRoutingModule } from './route/recipient-routing.module';

@NgModule({
  imports: [SharedModule, RecipientRoutingModule],
  declarations: [RecipientComponent, RecipientDetailComponent, RecipientUpdateComponent, RecipientDeleteDialogComponent],
  entryComponents: [RecipientDeleteDialogComponent],
})
export class RecipientModule {}
