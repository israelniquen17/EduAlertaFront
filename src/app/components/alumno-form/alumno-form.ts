import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeComponent],
  templateUrl: './alumno-form.html',
  styleUrls: ['./alumno-form.css']
})
export class AlumnoFormComponent {

  alumno = {
    dni: '',
    nombres: '',
    apellidos: '',
    grado: '',
    seccion: ''
  };

  mostrarQR = false;

  generarQR() {
    if (this.alumno.dni && this.alumno.nombres) {
      this.mostrarQR = true;
    }
  }

  get qrData(): string {
    return JSON.stringify(this.alumno);
  }

}
