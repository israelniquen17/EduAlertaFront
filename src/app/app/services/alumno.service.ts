import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private apiUrl = 'http://localhost:8080/api/alumnos';

  // 🔥 BehaviorSubject para mantener la lista reactiva
  private alumnosSubject = new BehaviorSubject<Alumno[]>([]);
  alumnos$ = this.alumnosSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 🔥 Listar todos los alumnos y actualizar el BehaviorSubject
  listarAlumnos() {
    return this.http.get<Alumno[]>(this.apiUrl)
      .pipe(
        tap(alumnos => this.alumnosSubject.next(alumnos))
      );
  }

  // 🔥 Obtener alumnos (método alternativo)
  obtenerAlumnos() {
    return this.listarAlumnos();
  }

  // 🔥 Crear un alumno y actualizar automáticamente la lista
  crearAlumno(alumno: Alumno) {
    return this.http.post<Alumno>(this.apiUrl, alumno)
      .pipe(
        tap(() => this.listarAlumnos().subscribe())
      );
  }

  // 🔥 Actualizar un alumno y actualizar automáticamente la lista
  actualizarAlumno(id: number, alumno: Alumno) {
    return this.http.put(`${this.apiUrl}/${id}`, alumno)
      .pipe(
        tap(() => this.listarAlumnos().subscribe())
      );
  }

  // 🔥 Eliminar un alumno y actualizar automáticamente la lista
  eliminarAlumno(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.listarAlumnos().subscribe())
      );
  }

  // 🔥 Obtener un alumno por ID
  obtenerPorId(id: number) {
    return this.http.get<Alumno>(`${this.apiUrl}/${id}`);
  }
}