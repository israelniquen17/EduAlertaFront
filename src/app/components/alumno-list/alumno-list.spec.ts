import { Component, OnInit } from '@angular/core';
import { AlumnoService, Alumno } from '../../app/services/alumno'

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

  }
