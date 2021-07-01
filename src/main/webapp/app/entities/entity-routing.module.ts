import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'address',
        data: { pageTitle: 'pensionsApp.address.home.title' },
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
      },
      {
        path: 'contact',
        data: { pageTitle: 'pensionsApp.contact.home.title' },
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
      },
      {
        path: 'recipient',
        data: { pageTitle: 'pensionsApp.recipient.home.title' },
        loadChildren: () => import('./recipient/recipient.module').then(m => m.RecipientModule),
      },
      {
        path: 'pension',
        data: { pageTitle: 'pensionsApp.pension.home.title' },
        loadChildren: () => import('./pension/pension.module').then(m => m.PensionModule),
      },
      {
        path: 'payment',
        data: { pageTitle: 'pensionsApp.payment.home.title' },
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
