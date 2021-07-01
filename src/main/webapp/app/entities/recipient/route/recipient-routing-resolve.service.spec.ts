jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRecipient, Recipient } from '../recipient.model';
import { RecipientService } from '../service/recipient.service';

import { RecipientRoutingResolveService } from './recipient-routing-resolve.service';

describe('Service Tests', () => {
  describe('Recipient routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RecipientRoutingResolveService;
    let service: RecipientService;
    let resultRecipient: IRecipient | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RecipientRoutingResolveService);
      service = TestBed.inject(RecipientService);
      resultRecipient = undefined;
    });

    describe('resolve', () => {
      it('should return IRecipient returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRecipient = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRecipient).toEqual({ id: 123 });
      });

      it('should return new IRecipient if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRecipient = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRecipient).toEqual(new Recipient());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Recipient })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRecipient = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRecipient).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
