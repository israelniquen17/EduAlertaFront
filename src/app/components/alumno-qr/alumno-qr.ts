import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-alumno-qr',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  template: `
    <h2>QR del Alumno</h2>

    <div *ngIf="alumno">
      <p><strong>Nombre:</strong> {{ alumno.nombres }} {{ alumno.apellidos }}</p>
      <p><strong>Grado:</strong> {{ alumno.grado }} {{ alumno.seccion }}</p>

      <qrcode
        [qrdata]="generarCodigo(alumno)"
        [width]="200">
      </qrcode>
    </div>
  `
})
export class AlumnoQrComponent {
  alumno = {
    nombres: 'Juan',
    apellidos: 'Pérez',
    grado: '5',
    seccion: 'A',
    dni: '12345678'
  };

  generarCodigo(alumno: any): string {
    return JSON.stringify(alumno);
  }
}
