import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PensionDetailComponent } from './pension-detail.component';

describe('Component Tests', () => {
  describe('Pension Management Detail Component', () => {
    let comp: PensionDetailComponent;
    let fixture: ComponentFixture<PensionDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PensionDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ pension: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PensionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PensionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load pension on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.pension).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
