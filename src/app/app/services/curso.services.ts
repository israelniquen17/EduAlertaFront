import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Curso {
  id?: number;
  nombre: string;
  grado: string;
  seccion: string;
  docenteId?: number;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'http://localhost:8080/cursos'; // URL del backend

  constructor(private http: HttpClient) {}

  // Obtener todos los cursos
  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  // Crear un nuevo curso
  crearCurso(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, curso);
  }
}