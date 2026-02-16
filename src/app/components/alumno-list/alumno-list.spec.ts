import { Component, OnInit } from '@angular/core';
import { AlumnoService, Alumno } from '../../app/alumno'

@Component({
  selector: 'app-alumno-list',
  templateUrl: './alumno-list.component.html'
})
export class AlumnoListComponent implements OnInit {

  alumnos: Alumno[] = [];
  qrImg: string | null = null;

  constructor(private alumnoService: AlumnoService) {}

  ngOnInit() {
    this.alumnoService.obtenerAlumnos().subscribe(res => this.alumnos = res);
  }

  verQr(codigoQr: string) {
    this.alumnoService.obtenerQr(codigoQr).subscribe(blob => {
      this.qrImg = URL.createObjectURL(blob);
    });
  }
}
