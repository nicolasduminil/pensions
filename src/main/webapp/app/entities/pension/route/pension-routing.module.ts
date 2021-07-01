import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PensionComponent } from '../list/pension.component';
import { PensionDetailComponent } from '../detail/pension-detail.component';
import { PensionUpdateComponent } from '../update/pension-update.component';
import { PensionRoutingResolveService } from './pension-routing-resolve.service';

const pensionRoute: Routes = [
  {
    path: '',
    component: PensionComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PensionDetailComponent,
    resolve: {
      pension: PensionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PensionUpdateComponent,
    resolve: {
      pension: PensionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PensionUpdateComponent,
    resolve: {
      pension: PensionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pensionRoute)],
  exports: [RouterModule],
})
export class PensionRoutingModule {}
