import { Component, NgZone, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlumnoService, Alumno, Notificacion, Padre } from '../../app/services/alumno';
import { AuthService } from '../../app/services/auth.service';

@Component({
  selector: 'app-padre',
  templateUrl: './padre.html',
  styleUrls: ['./padre.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PadreComponent implements OnInit, OnDestroy {
  usuario: any = null;
  padre: Padre | null = null;
  alumnos: Alumno[] = [];
  notificaciones: Notificacion[] = [];

  private eventSource: EventSource | null = null;
  private usuarioSub?: Subscription;

  constructor(
    private alumnoService: AlumnoService,
    private authService: AuthService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const stored = this.authService.getUsuario();

    if (stored) {
      this.establecerUsuario(stored);
    }

    this.usuarioSub = this.authService.usuario$.subscribe(usuario => {
      const usuarioActual = usuario ?? this.authService.getUsuario();

      if (!usuarioActual) {
        this.limpiarEstado();
        return;
      }

      if (this.usuario?.id !== usuarioActual.id) {
        this.establecerUsuario(usuarioActual);
      }
    });
  }

  ngOnDestroy(): void {
    this.cerrarStream();
    this.usuarioSub?.unsubscribe();
  }

  get nombreBienvenida(): string {
    if (!this.padre) return this.usuario?.usuario || '';

    const prefijo = this.obtenerPrefijo();
    return `${prefijo} ${this.padre.nombres} ${this.padre.apellidos}`.trim();
  }

  private obtenerPrefijo(): string {
    const nombres = `${this.padre?.nombres ?? ''} ${this.padre?.apellidos ?? ''}`.toLowerCase();

    if (
      nombres.includes('maria') ||
      nombres.includes('ana') ||
      nombres.includes('rosa') ||
      nombres.includes('elena') ||
      nombres.includes('luisa') ||
      nombres.includes('carmen')
    ) {
      return 'Sra.';
    }

    return 'Sr.';
  }

  private establecerUsuario(usuario: any): void {
    this.usuario = usuario;
    this.cargarPadre();
    this.cargarAlumno();
    this.cargarNotificaciones();
    this.iniciarStream();
    this.cdr.detectChanges();
  }

  private limpiarEstado(): void {
    this.usuario = null;
    this.padre = null;
    this.alumnos = [];
    this.notificaciones = [];
    this.cerrarStream();
    this.cdr.detectChanges();
  }

  private iniciarStream(): void {
    if (!this.usuario?.id) return;

    this.cerrarStream();

    this.eventSource = new EventSource(
      `http://localhost:8080/api/padres/usuario/${this.usuario.id}/stream`
    );

    this.eventSource.addEventListener('notificacion-update', () => {
      this.ngZone.run(() => {
        this.cargarPadre();
        this.cargarAlumno();
        this.cargarNotificaciones();
        this.cdr.detectChanges();
      });
    });

    this.eventSource.onerror = (error) => {
      console.error('Error en el stream de notificaciones:', error);
    };
  }

  private cerrarStream(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  private cargarPadre(): void {
    if (!this.usuario?.id) return;

    this.alumnoService.obtenerPadrePorUsuario(this.usuario.id).subscribe({
      next: (res: Padre) => {
        this.ngZone.run(() => {
          this.padre = res;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Error al traer datos del padre:', err);
          this.padre = null;
          this.cdr.detectChanges();
        });
      }
    });
  }

  private cargarAlumno(): void {
    if (!this.usuario?.id) return;

    this.alumnoService.obtenerAlumnosPorPadre(this.usuario.id).subscribe({
      next: (res: Alumno) => {
        this.ngZone.run(() => {
          this.alumnos = res ? [res] : [];
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Error al traer alumno del padre:', err);
          this.alumnos = [];
          this.cdr.detectChanges();
        });
      }
    });
  }

  private cargarNotificaciones(): void {
    if (!this.usuario?.id) return;

    this.alumnoService.obtenerNotificacionesPadre(this.usuario.id).subscribe({
      next: (res: Notificacion[]) => {
        this.ngZone.run(() => {
          this.notificaciones = res ?? [];
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Error al traer notificaciones:', err);
          this.notificaciones = [];
          this.cdr.detectChanges();
        });
      }
    });
  }

  marcarLeidas(): void {
    if (!this.usuario?.id || this.notificaciones.length === 0) return;

    this.alumnoService.marcarNotificacionesLeidas(this.usuario.id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.notificaciones = [];
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error al marcar notificaciones leídas:', err);
      }
    });
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}