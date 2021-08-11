import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavDirComponent } from './nav-dir.component';

describe('NavDirComponent', () => {
  let component: NavDirComponent;
  let fixture: ComponentFixture<NavDirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavDirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavDirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
