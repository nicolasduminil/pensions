import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RecipientComponent } from '../list/recipient.component';
import { RecipientDetailComponent } from '../detail/recipient-detail.component';
import { RecipientUpdateComponent } from '../update/recipient-update.component';
import { RecipientRoutingResolveService } from './recipient-routing-resolve.service';

const recipientRoute: Routes = [
  {
    path: '',
    component: RecipientComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RecipientDetailComponent,
    resolve: {
      recipient: RecipientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RecipientUpdateComponent,
    resolve: {
      recipient: RecipientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RecipientUpdateComponent,
    resolve: {
      recipient: RecipientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(recipientRoute)],
  exports: [RouterModule],
})
export class RecipientRoutingModule {}
