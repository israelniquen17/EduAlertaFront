import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocentePanelComponent } from './docente-panel';

describe('DocentePanel', () => {
  let component: DocentePanelComponent;
  let fixture: ComponentFixture<DocentePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocentePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocentePanelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
