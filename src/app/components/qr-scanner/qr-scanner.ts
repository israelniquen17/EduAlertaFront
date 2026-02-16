import { Component } from '@angular/core';
import { AlumnoService, Alumno } from '../../app/alumno';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner'; // <-- importante

@Component({
  selector: 'app-qr-scanner',
  standalone: true, // <-- necesario si es standalone
  imports: [CommonModule, FormsModule, ZXingScannerModule], // <-- importa el módulo del scanner
  templateUrl: './qr-scanner.html',
  styleUrls: ['./qr-scanner.css']
})
export class QrScannerComponent {

  alumno: Alumno | null = null;

  constructor(private alumnoService: AlumnoService) {}

  // onScan recibe un string, no un Event
  onScan(codigo: string) {
    console.log('Código QR escaneado:', codigo);
    this.alumnoService.obtenerPorQr(codigo).subscribe(res => {
      this.alumno = res;
    });
  }
}
