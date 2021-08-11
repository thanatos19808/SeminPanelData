import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavFisioComponent } from './nav-fisio.component';

describe('NavFisioComponent', () => {
  let component: NavFisioComponent;
  let fixture: ComponentFixture<NavFisioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavFisioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavFisioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
