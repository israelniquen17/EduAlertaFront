import { Alumno } from './alumno';

describe('Alumno', () => {
  let alumno: Alumno;

  beforeEach(() => {
    alumno = {
      dni: '12345678',
      nombres: 'Juan',
      apellidos: 'Pérez',
      grado: '5',
      seccion: 'A'
    };
  });

  it('should be created', () => {
    expect(alumno).toBeTruthy();
    expect(alumno.nombres).toBe('Juan');
  });
});
