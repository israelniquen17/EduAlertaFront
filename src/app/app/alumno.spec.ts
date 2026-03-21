import { Alumno } from './services/alumno';

describe('Alumno', () => {
  let alumno: Alumno;

  beforeEach(() => {
    alumno = {
      dni: '12345678',
      nombres: 'Juan',
      apellidos: 'Pérez',
      grado: '5',
      seccion: 'A',
      nivel: {
        id: 2,
        nombre: 'PRIMARIA'
      }
    };
  });

  it('should be created', () => {
    expect(alumno).toBeTruthy();
    expect(alumno.nombres).toBe('Juan');
    expect(alumno.nivel.nombre).toBe('PRIMARIA');
  });
});