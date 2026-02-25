import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadreComponent} from './padre';

describe('Padre', () => {
  let component: PadreComponent;
  let fixture: ComponentFixture<PadreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PadreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PadreComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
