import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { AlumnoService } from '../../app/services/alumno.service';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  templateUrl: './alumno-form.html',
  styleUrls: ['./alumno-form.css'],
  imports: [CommonModule, FormsModule, QRCodeComponent]
})
export class AlumnoFormComponent {

  alumno: any = {
    dni: '',
    nombres: '',
    apellidos: '',
    grado: '',
    seccion: ''
  };

  constructor(private alumnoService: AlumnoService) {}

  // 🔥 QR dinámico
  get qrData(): string {
    return JSON.stringify(this.alumno);
  }

  guardar() {
    this.alumnoService.crearAlumno(this.alumno)
      .subscribe(() => {
        alert('Alumno registrado correctamente');
      });
  }
}