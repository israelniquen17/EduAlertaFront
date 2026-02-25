import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private apiUrl = 'http://localhost:8080/api/alumnos';

  constructor(private http: HttpClient) {}

  // 🔹 Crear un alumno
  crearAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(this.apiUrl, alumno);
  }

  // 🔹 Listar todos los alumnos
  obtenerAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.apiUrl);
  }

  // 🔹 Obtener alumno por DNI (para escaneo QR)
  obtenerPorQr(dni: string): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/dni/${dni}`);
  }

  // 🔹 Obtener alumno por ID
  obtenerPorId(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Actualizar un alumno
  actualizarAlumno(id: number, alumno: Alumno): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.apiUrl}/${id}`, alumno);
  }

  // 🔹 Eliminar un alumno
  eliminarAlumno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Obtener QR en formato blob
  obtenerQr(codigoQr: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/qr/${codigoQr}`, { responseType: 'blob' });
  }
}