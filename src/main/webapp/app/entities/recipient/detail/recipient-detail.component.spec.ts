import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RecipientDetailComponent } from './recipient-detail.component';

describe('Component Tests', () => {
  describe('Recipient Management Detail Component', () => {
    let comp: RecipientDetailComponent;
    let fixture: ComponentFixture<RecipientDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RecipientDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ recipient: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RecipientDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RecipientDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load recipient on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.recipient).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
