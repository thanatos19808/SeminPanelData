import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavExtComponent } from './nav-ext.component';

describe('NavExtComponent', () => {
  let component: NavExtComponent;
  let fixture: ComponentFixture<NavExtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavExtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavExtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
