import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisosPanelCorporativoComponent } from './permisos-panel-corporativo.component';

describe('PermisosPanelCorporativoComponent', () => {
  let component: PermisosPanelCorporativoComponent;
  let fixture: ComponentFixture<PermisosPanelCorporativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermisosPanelCorporativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisosPanelCorporativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
