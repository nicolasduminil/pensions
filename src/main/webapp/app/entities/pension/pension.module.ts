import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PensionComponent } from './list/pension.component';
import { PensionDetailComponent } from './detail/pension-detail.component';
import { PensionUpdateComponent } from './update/pension-update.component';
import { PensionDeleteDialogComponent } from './delete/pension-delete-dialog.component';
import { PensionRoutingModule } from './route/pension-routing.module';

@NgModule({
  imports: [SharedModule, PensionRoutingModule],
  declarations: [PensionComponent, PensionDetailComponent, PensionUpdateComponent, PensionDeleteDialogComponent],
  entryComponents: [PensionDeleteDialogComponent],
})
export class PensionModule {}
