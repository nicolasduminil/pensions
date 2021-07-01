import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPension, Pension } from '../pension.model';
import { PensionService } from '../service/pension.service';

@Injectable({ providedIn: 'root' })
export class PensionRoutingResolveService implements Resolve<IPension> {
  constructor(protected service: PensionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPension> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pension: HttpResponse<Pension>) => {
          if (pension.body) {
            return of(pension.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Pension());
  }
}
