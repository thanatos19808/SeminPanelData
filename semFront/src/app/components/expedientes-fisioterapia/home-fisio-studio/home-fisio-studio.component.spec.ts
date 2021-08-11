import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFisioStudioComponent } from './home-fisio-studio.component';

describe('HomeFisioStudioComponent', () => {
  let component: HomeFisioStudioComponent;
  let fixture: ComponentFixture<HomeFisioStudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeFisioStudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFisioStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
