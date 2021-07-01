import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRecipient } from '../recipient.model';

@Component({
  selector: 'jhi-recipient-detail',
  templateUrl: './recipient-detail.component.html',
})
export class RecipientDetailComponent implements OnInit {
  recipient: IRecipient | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recipient }) => {
      this.recipient = recipient;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
