import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

// 🔹 Interfaz Alumno
export interface Alumno {
  id?: number;
  codigoQr?: string;
  dni: string;
  nombres: string;
  apellidos: string;
  grado: string;
  seccion: string;
  estado?: string;
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

  // 🔹 Listar todos los alumnos
  listarAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(`${this.apiUrl}/alumnos`)
      .pipe(tap(alumnos => this.alumnosSubject.next(alumnos)));
  }

  // 🔹 Obtener alumnos (método alternativo)
  obtenerAlumnos(): Observable<Alumno[]> {
    return this.listarAlumnos();
  }

  // 🔹 Crear un alumno
  crearAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(`${this.apiUrl}/alumnos`, alumno)
      .pipe(tap(() => this.listarAlumnos().subscribe()));
  }

  // 🔹 Actualizar un alumno
  actualizarAlumno(id: number, alumno: Alumno): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.apiUrl}/alumnos/${id}`, alumno)
      .pipe(tap(() => this.listarAlumnos().subscribe()));
  }

  // 🔹 Eliminar un alumno
  eliminarAlumno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/alumnos/${id}`)
      .pipe(tap(() => this.listarAlumnos().subscribe()));
  }

  // 🔹 Obtener un alumno por ID
  obtenerPorId(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/alumnos/${id}`);
  }

  // 🔹 Obtener alumno vinculado a un padre (solo 1)
  obtenerAlumnosPorPadre(padreId: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/padres/usuario/${padreId}/alumno`);
  }

  // 🔹 Obtener notificaciones del padre
  obtenerNotificacionesPadre(padreId: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/padres/${padreId}/notificaciones`);
  }

  // 🔹 Marcar notificaciones como leídas
  marcarNotificacionesLeidas(padreId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/padres/${padreId}/notificaciones/leidas`, {});
  }
}