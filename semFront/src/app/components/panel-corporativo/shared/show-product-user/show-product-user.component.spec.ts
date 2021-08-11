import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProductUserComponent } from './show-product-user.component';

describe('ShowProductUserComponent', () => {
  let component: ShowProductUserComponent;
  let fixture: ComponentFixture<ShowProductUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowProductUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProductUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
