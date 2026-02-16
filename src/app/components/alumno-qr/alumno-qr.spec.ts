import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoQrComponent} from './alumno-qr';

describe('AlumnoQr', () => {
  let component: AlumnoQrComponent;
  let fixture: ComponentFixture<AlumnoQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnoQrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnoQrComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
