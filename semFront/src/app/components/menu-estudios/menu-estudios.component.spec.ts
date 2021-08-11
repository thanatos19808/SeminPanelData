import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEstudiosComponent } from './menu-estudios.component';

describe('MenuEstudiosComponent', () => {
  let component: MenuEstudiosComponent;
  let fixture: ComponentFixture<MenuEstudiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuEstudiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuEstudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
