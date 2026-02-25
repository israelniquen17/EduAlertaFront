import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

// 🔹 Interfaz Alumno
export interface Alumno {
  id?: number;
  codigoQr?: string;
  dni: string;
  nombres: string;
  apellidos: string;
  grado: string;
  seccion: string;
  estado?: 'ACTIVO' | 'INACTIVO';
}

// 🔹 Interfaz Notificación
export interface Notificacion {
  id?: number;
  mensaje: string;
  fecha?: string;
  hora?: string;
  leida?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private apiUrl = 'http://localhost:8080/api'; // Base general

  // 🔹 BehaviorSubject para lista reactiva de alumnos
  private alumnosSubject = new BehaviorSubject<Alumno[]>([]);
  alumnos$ = this.alumnosSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 🔹 Listar todos los alumnos y actualizar BehaviorSubject
  listarAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(`${this.apiUrl}/alumnos`)
      .pipe(tap(alumnos => this.alumnosSubject.next(alumnos)));
  }

  obtenerAlumnos(): Observable<Alumno[]> {
    return this.listarAlumnos();
  }

  crearAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(`${this.apiUrl}/alumnos`, alumno)
      .pipe(tap(() => this.listarAlumnos().subscribe()));
  }

  actualizarAlumno(id: number, alumno: Alumno): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.apiUrl}/alumnos/${id}`, alumno)
      .pipe(tap(() => this.listarAlumnos().subscribe()));
  }

  eliminarAlumno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/alumnos/${id}`)
      .pipe(tap(() => this.listarAlumnos().subscribe()));
  }

  obtenerPorId(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/alumnos/${id}`);
  }

  obtenerPorQr(dni: string): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/historial/asistencia/dni/${dni}`);
  }

  // 🔹 Registrar asistencia y generar notificación vinculada al padre
  registrarAsistencia(dni: string, dispositivo: string = 'PC'): Observable<any> {
    return this.http.post(`${this.apiUrl}/historial/asistencia/dni/${dni}`, { dispositivo });
  }

  // 🔹 Obtener alumnos vinculados a un padre
// AlumnoService
// AlumnoService
obtenerAlumnosPorPadre(padreId: number): Observable<Alumno> {
  return this.http.get<Alumno>(`${this.apiUrl}/padres/usuario/${padreId}/alumno`);
}
  // 🔹 Obtener notificaciones de un padre
  obtenerNotificacionesPadre(padreId: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/padres/${padreId}/notificaciones`);
  }

  // 🔹 Marcar notificaciones como leídas
  marcarNotificacionesLeidas(padreId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/padres/${padreId}/notificaciones/leidas`, {});
  }
  obtenerPorIdDni(dni: string): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/alumnos/dni/${dni}`);
  }


}