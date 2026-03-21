import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Nivel {
  id: number;
  nombre: string;
}

interface Curso {
  id: number;
  nombre: string;
  nivel: Nivel | null;
  grado: string;
  seccion: string;
  estado?: string;
}

interface Docente {
  id?: number;
  dni: string;
  nombres: string;
  apellidos: string;
  nivel: Nivel | null;
  grado: string;
  seccion: string;
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
  cursosFiltrados: Curso[] = [];
  niveles: Nivel[] = [];

  gradosInicial = ['3 años', '4 años', '5 años'];
  gradosPrimaria = ['1ro', '2do', '3ro', '4to', '5to', '6to'];
  gradosSecundaria = ['1ro', '2do', '3ro', '4to', '5to'];
  secciones = ['A', 'B', 'C', 'D'];
  gradosDisponibles: string[] = [];

  nuevoDocente: Docente = {
    dni: '',
    nombres: '',
    apellidos: '',
    nivel: null,
    grado: '',
    seccion: ''
  };

  cursoSeleccionadoId: number | null = null;
  modoEdicion = false;
  mensajeError = '';
  mensajeOk = '';

  apiUrl = 'http://localhost:8080/api/docentes';
  apiCursoUrl = 'http://localhost:8080/api/cursos';
  apiNivelUrl = 'http://localhost:8080/api/niveles';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.listarDocentes();
    this.listarCursos();
    this.listarNiveles();
  }

  listarDocentes() {
    this.http.get<Docente[]>(this.apiUrl).subscribe({
      next: data => {
        console.log('Docentes cargados:', data);
        this.docentes = data;
        this.mensajeError = '';
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al listar docentes:', err);
        this.mensajeError = err.error?.message || err.error?.mensaje || 'No se pudo cargar docentes';
      }
    });
  }

  listarCursos() {
    this.http.get<Curso[]>(this.apiCursoUrl).subscribe({
      next: data => {
        console.log('Cursos cargados:', data);
        this.cursos = data;
        this.filtrarCursos();
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al listar cursos:', err);
        this.mensajeError = err.error?.message || err.error?.mensaje || 'No se pudo cargar cursos';
      }
    });
  }

  listarNiveles() {
    this.http.get<Nivel[]>(this.apiNivelUrl).subscribe({
      next: data => {
        console.log('Niveles cargados:', data);
        this.niveles = data;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al listar niveles:', err);
        this.mensajeError = err.error?.message || err.error?.mensaje || 'No se pudo cargar niveles';
      }
    });
  }

  actualizarGrados() {
    const nivelId = Number(this.nuevoDocente.nivel?.id);

    if (nivelId === 1) {
      this.gradosDisponibles = [...this.gradosInicial];
    } else if (nivelId === 2) {
      this.gradosDisponibles = [...this.gradosPrimaria];
    } else if (nivelId === 3) {
      this.gradosDisponibles = [...this.gradosSecundaria];
    } else {
      this.gradosDisponibles = [];
    }

    if (!this.gradosDisponibles.includes(this.nuevoDocente.grado)) {
      this.nuevoDocente.grado = '';
    }

    this.filtrarCursos();
  }

  filtrarCursos() {
    const nivelId = Number(this.nuevoDocente.nivel?.id);
    const grado = this.nuevoDocente.grado;
    const seccion = this.nuevoDocente.seccion;

    this.cursosFiltrados = this.cursos.filter(c =>
      (!nivelId || c.nivel?.id === nivelId) &&
      (!grado || c.grado === grado) &&
      (!seccion || c.seccion === seccion)
    );

    if (this.cursoSeleccionadoId) {
      const existe = this.cursosFiltrados.some(c => c.id === this.cursoSeleccionadoId);
      if (!existe) {
        this.cursoSeleccionadoId = null;
      }
    }

    this.cdr.detectChanges();
  }

  guardarDocente() {
    const payload = {
      ...this.nuevoDocente,
      dni: this.nuevoDocente.dni.trim(),
      nombres: this.nuevoDocente.nombres.trim(),
      apellidos: this.nuevoDocente.apellidos.trim(),
      grado: this.nuevoDocente.grado.trim(),
      seccion: this.nuevoDocente.seccion.trim(),
      nivel: this.nuevoDocente.nivel ? { id: this.nuevoDocente.nivel.id } : null
    };

    if (!payload.dni || !payload.nombres || !payload.apellidos || !payload.nivel || !payload.grado || !payload.seccion) {
      this.mensajeError = 'Completa todos los campos obligatorios';
      this.mensajeOk = '';
      return;
    }

    if (!/^\d{8}$/.test(payload.dni)) {
      this.mensajeError = 'El DNI debe tener 8 dígitos';
      this.mensajeOk = '';
      return;
    }

    this.mensajeError = '';
    this.mensajeOk = '';

    if (this.modoEdicion && this.nuevoDocente.id) {
      this.http.put<Docente>(`${this.apiUrl}/${this.nuevoDocente.id}`, payload).subscribe({
        next: docente => this.asignarCursoSiCorresponde(docente.id!, 'Docente actualizado correctamente'),
        error: (err: HttpErrorResponse) => {
          console.error('Error al actualizar docente:', err);
          this.mensajeError = err.error?.message || err.error?.mensaje || 'No se pudo actualizar';
        }
      });
    } else {
      this.http.post<Docente>(this.apiUrl, payload).subscribe({
        next: docente => this.asignarCursoSiCorresponde(docente.id!, 'Docente registrado correctamente'),
        error: (err: HttpErrorResponse) => {
          console.error('Error al registrar docente:', err);
          this.mensajeError = err.error?.message || err.error?.mensaje || 'No se pudo registrar';
        }
      });
    }
  }

  asignarCursoSiCorresponde(docenteId: number, mensaje: string) {
    if (!this.cursoSeleccionadoId) {
      this.listarDocentes();
      this.resetFormulario();
      this.mensajeOk = mensaje;
      return;
    }

    this.http.put<Docente>(`${this.apiUrl}/${docenteId}/asignar-curso/${this.cursoSeleccionadoId}`, {}).subscribe({
      next: () => {
        this.listarDocentes();
        this.resetFormulario();
        this.mensajeOk = mensaje;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al asignar curso:', err);
        this.mensajeError = err.error?.message || err.error?.mensaje || 'Se guardó el docente, pero no se asignó el curso';
      }
    });
  }

  quitarCurso(docenteId?: number, cursoId?: number) {
    if (!docenteId || !cursoId) return;

    this.http.delete<Docente>(`${this.apiUrl}/${docenteId}/quitar-curso/${cursoId}`).subscribe({
      next: () => {
        this.listarDocentes();
        this.mensajeOk = 'Curso quitado correctamente';
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al quitar curso:', err);
        this.mensajeError = err.error?.message || err.error?.mensaje || 'No se pudo quitar el curso';
      }
    });
  }

  editarDocente(docente: Docente) {
    this.nuevoDocente = {
      ...docente,
      nivel: docente.nivel ? { ...docente.nivel } : null
    };

    this.actualizarGrados();
    this.filtrarCursos();
    this.modoEdicion = true;
    this.mensajeError = '';
    this.mensajeOk = '';
  }

  eliminarDocente(id?: number) {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este docente?')) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.listarDocentes();
        this.mensajeOk = 'Docente eliminado correctamente';
        this.mensajeError = '';
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al eliminar docente:', err);
        this.mensajeError = err.error?.message || err.error?.mensaje || 'No se pudo eliminar el docente';
      }
    });
  }

  resetFormulario() {
    this.nuevoDocente = {
      dni: '',
      nombres: '',
      apellidos: '',
      nivel: null,
      grado: '',
      seccion: ''
    };

    this.gradosDisponibles = [];
    this.cursosFiltrados = [];
    this.cursoSeleccionadoId = null;
    this.modoEdicion = false;
    this.mensajeError = '';
  }
}