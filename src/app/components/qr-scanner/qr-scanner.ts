import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AlumnoService, Alumno } from '../../app/services/alumno';
import { HttpClient } from '@angular/common/http';

interface AsistenciaResponse {
  mensaje: string;
  alumno: string;
  hora: string;
}

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './qr-scanner.html',
  styleUrls: ['./qr-scanner.css']
})
export class QrScannerComponent {

  alumno: Alumno | null = null;
  escaneado = false;
  alertado = false;

  private qrDataEscaneada = '';
  private apiAsistencia = 'http://localhost:8080/api/asistencia/registrar';

  constructor(
    private alumnoService: AlumnoService,
    private http: HttpClient
  ) {}

  onScan(resultado: string): void {
    if (this.escaneado) return;

    this.qrDataEscaneada = resultado.trim();

    let dni = '';

    try {
      const data = JSON.parse(this.qrDataEscaneada);
      if (data?.dni) {
        dni = String(data.dni).trim();
      }
    } catch {
      const texto = this.qrDataEscaneada;

      if (texto.startsWith('QR-')) {
        dni = texto.replace('QR-', '').trim();
      } else {
        dni = texto.trim();
      }
    }

    if (!dni) {
      alert('QR inválido');
      this.reiniciar();
      return;
    }

    this.alumnoService.obtenerPorIdDni(dni).subscribe({
      next: (data: Alumno) => {
        this.alumno = data;
        this.escaneado = true;
        this.alertado = false;
      },
      error: () => {
        alert('Alumno no encontrado');
        this.reiniciar();
      }
    });
  }

  reiniciar(): void {
    this.escaneado = false;
    this.alumno = null;
    this.alertado = false;
    this.qrDataEscaneada = '';
  }

  alertarAsistencia(): void {
    if (!this.alumno || !this.qrDataEscaneada || this.alertado) return;

    this.http.post<AsistenciaResponse>(this.apiAsistencia, {
      qrData: this.qrDataEscaneada,
      dispositivo: 'Web QR Scanner'
    }).subscribe({
      next: (res) => {
        this.alertado = true;
        alert(`${res.mensaje}\nAlumno: ${res.alumno}\nHora: ${res.hora}`);
      },
      error: (err) => {
        console.error('Error al registrar asistencia:', err);
        alert(err.error?.message || err.error?.mensaje || 'Error al registrar asistencia');
      }
    });
  }
}