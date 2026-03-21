import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface Nivel {
  id: number;
  nombre: string;
}

export interface Padre {
  id?: number;
  dni?: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
}

export interface Alumno {
  id?: number;
  codigoQr?: string;
  dni: string;
  nombres: string;
  apellidos: string;
  grado: string;
  seccion: string;
  nivel: Nivel;
  padres?: Padre[];
  estado?: 'ACTIVO' | 'INACTIVO';
}

export interface Notificacion {
  id?: number;
  mensaje: string;
  fecha?: string;
  hora?: string;
  leido?: boolean;
}

export interface AsistenciaResponse {
  mensaje: string;
  alumno: string;
  hora: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiUrl = 'http://localhost:8080/api';
  private apiAlumnos = `${this.apiUrl}/alumnos`;
  private apiPadres = `${this.apiUrl}/padres`;
  private apiAsistencia = `${this.apiUrl}/asistencia`;

  private alumnosSubject = new BehaviorSubject<Alumno[]>([]);
  alumnos$ = this.alumnosSubject.asObservable();

  constructor(private http: HttpClient) {}

  private refrescarAlumnos(): void {
    this.http.get<Alumno[]>(this.apiAlumnos).subscribe({
      next: (alumnos) => this.alumnosSubject.next(alumnos),
      error: (err) => console.error('Error al refrescar alumnos:', err)
    });
  }

  listarAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.apiAlumnos).pipe(
      tap((alumnos) => this.alumnosSubject.next(alumnos))
    );
  }

  obtenerAlumnos(): Observable<Alumno[]> {
    return this.listarAlumnos();
  }

  crearAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(this.apiAlumnos, alumno).pipe(
      tap(() => this.refrescarAlumnos())
    );
  }

  actualizarAlumno(id: number, alumno: Alumno): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.apiAlumnos}/${id}`, alumno).pipe(
      tap(() => this.refrescarAlumnos())
    );
  }

  eliminarAlumno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiAlumnos}/${id}`).pipe(
      tap(() => this.refrescarAlumnos())
    );
  }

  obtenerPorId(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiAlumnos}/${id}`);
  }

  obtenerPorQr(dni: string): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiAlumnos}/dni/${dni}`);
  }

  registrarAsistencia(qrData: string, dispositivo: string = 'PC'): Observable<AsistenciaResponse> {
    return this.http.post<AsistenciaResponse>(`${this.apiAsistencia}/registrar`, {
      qrData,
      dispositivo
    });
  }

  obtenerAlumnosPorPadre(usuarioId: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiPadres}/usuario/${usuarioId}/alumno`);
  }

  obtenerNotificacionesPadre(usuarioId: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(
      `${this.apiPadres}/usuario/${usuarioId}/notificaciones`
    );
  }

  marcarNotificacionesLeidas(usuarioId: number): Observable<string> {
    return this.http.put(
      `${this.apiPadres}/usuario/${usuarioId}/notificaciones/marcar-leidas`,
      {},
      { responseType: 'text' }
    );
  }

  obtenerPorIdDni(dni: string): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiAlumnos}/dni/${dni}`);
  }

  obtenerPadrePorUsuario(usuarioId: number): Observable<Padre> {
  return this.http.get<Padre>(`${this.apiPadres}/usuario/${usuarioId}`);
}
}