import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../app/services/auth.service';

interface AsistenciaHoy {
  dni: string;
  nombre: string;
  grado: string;
  seccion: string;
  estado: string;
  horaIngreso: string;
}

interface DashboardResumen {
  totalAlumnos: number;
  presentes: number;
  ausentes: number;
  tardanzas: number;
  asistenciasHoy: AsistenciaHoy[];
  alertas: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  usuarioLogueado: any = null;

  totalAlumnos = 0;
  presentes = 0;
  ausentes = 0;
  tardanzas = 0;

  asistenciasHoy: AsistenciaHoy[] = [];
  alertas: string[] = [];

  cargando = true;
  mensajeError = '';

  apiUrl = 'http://localhost:8080/api/dashboard';
  private eventSource: EventSource | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.usuarioLogueado = this.authService.getUsuario();

    // Carga inicial
    this.cargarDashboard();

    // Escucha cambios en tiempo real
    this.iniciarStream();
  }

  ngOnDestroy(): void {
    this.cerrarStream();
  }

  cargarDashboard(silencioso: boolean = false): void {
    if (!silencioso) {
      this.cargando = true;
      this.mensajeError = '';
      this.cdr.detectChanges();
    }

    this.http.get<DashboardResumen>(this.apiUrl).subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.totalAlumnos = data.totalAlumnos ?? 0;
          this.presentes = data.presentes ?? 0;
          this.ausentes = data.ausentes ?? 0;
          this.tardanzas = data.tardanzas ?? 0;
          this.asistenciasHoy = data.asistenciasHoy ?? [];
          this.alertas = data.alertas ?? [];
          this.cargando = false;
          this.mensajeError = '';

          this.cdr.detectChanges();
        });
      },
      error: (err: HttpErrorResponse) => {
        this.ngZone.run(() => {
          console.error('Error al cargar dashboard:', err);
          this.mensajeError =
            err.error?.message ||
            err.error?.mensaje ||
            'No se pudo cargar el dashboard.';
          this.cargando = false;

          this.cdr.detectChanges();
        });
      }
    });
  }

  private iniciarStream(): void {
    this.cerrarStream();

    this.eventSource = new EventSource(`${this.apiUrl}/stream`);

    this.eventSource.addEventListener('dashboard-update', () => {
      this.ngZone.run(() => {
        this.cargarDashboard(true);
      });
    });

    this.eventSource.onerror = (error) => {
      console.error('Error en el stream del dashboard:', error);
    };
  }

  private cerrarStream(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  get porcentajeAsistencia(): number {
    if (!this.totalAlumnos || this.totalAlumnos <= 0) return 0;
    return Math.round((this.presentes / this.totalAlumnos) * 100);
  }

  get fechaActual(): string {
    return new Date().toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}