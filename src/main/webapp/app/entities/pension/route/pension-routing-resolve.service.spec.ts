jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPension, Pension } from '../pension.model';
import { PensionService } from '../service/pension.service';

import { PensionRoutingResolveService } from './pension-routing-resolve.service';

describe('Service Tests', () => {
  describe('Pension routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PensionRoutingResolveService;
    let service: PensionService;
    let resultPension: IPension | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PensionRoutingResolveService);
      service = TestBed.inject(PensionService);
      resultPension = undefined;
    });

    describe('resolve', () => {
      it('should return IPension returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPension = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPension).toEqual({ id: 123 });
      });

      it('should return new IPension if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPension = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPension).toEqual(new Pension());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Pension })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPension = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPension).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
