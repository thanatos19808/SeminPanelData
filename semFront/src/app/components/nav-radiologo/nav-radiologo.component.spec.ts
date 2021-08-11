import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavRadiologoComponent } from './nav-radiologo.component';

describe('NavRadiologoComponent', () => {
  let component: NavRadiologoComponent;
  let fixture: ComponentFixture<NavRadiologoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavRadiologoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavRadiologoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
