import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoTicketComponent } from './promo-ticket.component';

describe('PromoTicketComponent', () => {
  let component: PromoTicketComponent;
  let fixture: ComponentFixture<PromoTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
