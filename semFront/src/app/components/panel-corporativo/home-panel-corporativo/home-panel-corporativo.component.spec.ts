import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePanelCorporativoComponent } from './home-panel-corporativo.component';

describe('HomePanelCorporativoComponent', () => {
  let component: HomePanelCorporativoComponent;
  let fixture: ComponentFixture<HomePanelCorporativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePanelCorporativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePanelCorporativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
