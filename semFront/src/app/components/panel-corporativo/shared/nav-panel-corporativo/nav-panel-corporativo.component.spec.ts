import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPanelCorporativoComponent } from './nav-panel-corporativo.component';

describe('NavPanelCorporativoComponent', () => {
  let component: NavPanelCorporativoComponent;
  let fixture: ComponentFixture<NavPanelCorporativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavPanelCorporativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavPanelCorporativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
