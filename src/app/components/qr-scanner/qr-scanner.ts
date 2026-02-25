import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AlumnoService, Alumno } from '../../app/alumno';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './qr-scanner.html',
  styleUrls: ['./qr-scanner.css']
})
export class QrScannerComponent {

  alumno: Alumno | null = null;
  escaneado: boolean = false;
  alertado: boolean = false;

  private apiHistorial = 'http://localhost:8080/api/historial/asistencia/dni';

  constructor(private alumnoService: AlumnoService, private http: HttpClient) {}

  onScan(resultado: string): void {
    if (this.escaneado) return;

    let dni: string;
    try { dni = JSON.parse(resultado).dni; }
    catch { dni = resultado.trim(); }

    console.log("DNI escaneado:", dni);

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
  }

  alertarAsistencia(): void {
    if (!this.alumno || this.alertado) return;

    this.http.post(`${this.apiHistorial}/${this.alumno.dni}`,
                   { dispositivo: 'Web QR Scanner' },
                   { responseType: 'text' })
      .subscribe({
        next: (res: string) => {
          this.alertado = true;
          alert(res);
        },
        error: () => alert('Error al registrar asistencia')
      });
  }
}