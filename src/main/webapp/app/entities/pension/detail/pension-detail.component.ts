import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPension } from '../pension.model';

@Component({
  selector: 'jhi-pension-detail',
  templateUrl: './pension-detail.component.html',
})
export class PensionDetailComponent implements OnInit {
  pension: IPension | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pension }) => {
      this.pension = pension;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
