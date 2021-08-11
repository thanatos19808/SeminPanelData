import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavopComponent } from './navop.component';

describe('NavopComponent', () => {
  let component: NavopComponent;
  let fixture: ComponentFixture<NavopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
