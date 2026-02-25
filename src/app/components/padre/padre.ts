import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlumnoService, Alumno, Notificacion } from '../../app/alumno';
import { AuthService } from '../../app/services/auth.service';

@Component({
  selector: 'app-padre',
  templateUrl: './padre.html',
  styleUrls: ['./padre.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class PadreComponent implements OnInit {

  usuario: any = null;
  alumnos: Alumno[] = [];
  notificaciones: Notificacion[] = [];

  constructor(
    private alumnoService: AlumnoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Escuchar cambios de usuario logueado
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      if (this.usuario) this.cargarAlumnoYNotificaciones();
      else {
        this.alumnos = [];
        this.notificaciones = [];
      }
    });

    // Cargar si ya había usuario en localStorage
    const stored = this.authService.getUsuario();
    if (stored) {
      this.usuario = stored;
      this.cargarAlumnoYNotificaciones();
    }
  }

  cargarAlumnoYNotificaciones() {
    if (!this.usuario) return;

    // 🔹 Cargar alumno vinculado
    this.alumnoService.obtenerAlumnosPorPadre(this.usuario.id).subscribe(
      (res: Alumno) => {
        this.alumnos = res ? [res] : [];
        this.cdr.detectChanges();
      },
      err => console.error('Error al traer alumno:', err)
    );

    // 🔹 Cargar notificaciones del padre
    this.alumnoService.obtenerNotificacionesPadre(this.usuario.id).subscribe(
      (res: Notificacion[]) => {
        this.notificaciones = res;
        this.cdr.detectChanges();
      },
      err => console.error('Error al traer notificaciones:', err)
    );
  }

  marcarLeidas(): void {
    if (!this.usuario) return;

    this.alumnoService.marcarNotificacionesLeidas(this.usuario.id).subscribe(
      () => this.notificaciones = [],
      err => console.error('Error al marcar notificaciones leídas:', err)
    );
  }
}