import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Curso {
  id: number;
  nombre: string;
  grado: string;
  seccion: string;
  estado?: string;
}

interface Docente {
  id?: number;
  nombres: string;
  apellidos: string;
  dni: string;
  grado?: string;
  seccion?: string;
  estado?: string;
  cursos?: Curso[];
}

@Component({
  selector: 'app-docente',
  standalone: true,
  templateUrl: './docente.html',
  styleUrls: ['./docente.css'],
  imports: [CommonModule, FormsModule]
})
export class DocenteComponent implements OnInit {

  docentes: Docente[] = [];
  cursos: Curso[] = [];

  nuevoDocente: Docente = {
    nombres: '',
    apellidos: '',
    dni: '',
    grado: '',
    seccion: ''
  };

  cursoSeleccionadoId: number | null = null;

  modoEdicion = false;
  mensajeError = '';

  apiUrl = 'http://localhost:8080/api/docentes';
  apiCursoUrl = 'http://localhost:8080/api/cursos';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.listarDocentes();
    this.listarCursos();
  }

  listarDocentes() {
    this.http.get<Docente[]>(this.apiUrl).subscribe({
      next: data => {
        this.docentes = data;
        this.mensajeError = '';
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.mensajeError = 'No se pudo cargar la lista de docentes.';
      }
    });
  }

  listarCursos() {
    this.http.get<Curso[]>(this.apiCursoUrl).subscribe({
      next: data => this.cursos = data,
      error: err => console.error(err)
    });
  }

guardarDocente() {

  if (!this.nuevoDocente.nombres || !this.nuevoDocente.apellidos || !this.nuevoDocente.dni) {
    alert('Completa todos los campos obligatorios');
    return;
  }

  if (this.modoEdicion && this.nuevoDocente.id) {

    this.http.put<Docente>(`${this.apiUrl}/${this.nuevoDocente.id}`, this.nuevoDocente)
      .subscribe({
        next: docenteActualizado => {

          if (this.cursoSeleccionadoId) {

            this.http.put(
              `${this.apiCursoUrl}/${this.cursoSeleccionadoId}/asignar-docente/${docenteActualizado.id}`,
              {}
            ).subscribe(() => {

              // 🔥 AQUÍ recién actualizamos la tabla
              this.listarDocentes();
              this.resetFormulario();

            });

          } else {

            this.listarDocentes();
            this.resetFormulario();
          }

        },
        error: () => this.mensajeError = 'No se pudo actualizar el docente.'
      });

  } else {

    this.http.post<Docente>(this.apiUrl, this.nuevoDocente)
      .subscribe({
        next: docenteGuardado => {

          if (this.cursoSeleccionadoId) {

            this.http.put(
              `${this.apiCursoUrl}/${this.cursoSeleccionadoId}/asignar-docente/${docenteGuardado.id}`,
              {}
            ).subscribe(() => {

              // 🔥 AQUÍ también esperamos
              this.listarDocentes();
              this.resetFormulario();

            });

          } else {

            this.listarDocentes();
            this.resetFormulario();
          }

        },
        error: () => this.mensajeError = 'No se pudo agregar el docente.'
      });
  }
}

  asignarCurso(docenteId: number) {
    this.http.put(
      `${this.apiCursoUrl}/${this.cursoSeleccionadoId}/asignar-docente/${docenteId}`,
      {}
    ).subscribe();
  }

  editarDocente(docente: Docente) {
    this.nuevoDocente = { ...docente };
    this.modoEdicion = true;
  }

  eliminarDocente(id?: number) {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este docente?')) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.listarDocentes(),
      error: () => this.mensajeError = 'No se pudo eliminar el docente.'
    });
  }

  resetFormulario() {
    this.nuevoDocente = {
      nombres: '',
      apellidos: '',
      dni: '',
      grado: '',
      seccion: ''
    };
    this.cursoSeleccionadoId = null;
    this.modoEdicion = false;
    this.mensajeError = '';
  }
}