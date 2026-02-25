import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AlumnoService,Alumno } from '../../app/alumno';
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

  constructor(private alumnoService: AlumnoService) {}

  // Se llama al detectar QR
  onScan(resultado: string): void {
    if (this.escaneado) return;

    this.escaneado = true;
    const dni: string = resultado.trim();

    this.alumnoService.obtenerPorQr(dni).subscribe({
      next: (data: Alumno) => {
        this.alumno = data;
      },
      error: (err: any) => {
        console.error(err);
        alert('Alumno no encontrado');
        this.reiniciar();
      }
    });
  }

  // Reinicia el scanner para volver a escanear
  reiniciar(): void {
    this.escaneado = false;
    this.alumno = null;
  }
}