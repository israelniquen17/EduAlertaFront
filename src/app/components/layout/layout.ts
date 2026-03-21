import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class LayoutComponent implements OnInit {

  menuAbierto = false;
  usuario: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const data = localStorage.getItem('user');
    this.usuario = data ? JSON.parse(data) : null;
  }

  get esAdmin(): boolean {
    return this.usuario?.rol === 'ADMIN';
  }

  get esDocente(): boolean {
    return this.usuario?.rol === 'DOCENTE';
  }

  get esPadre(): boolean {
    return this.usuario?.rol === 'PADRE';
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  cerrarMenuSiMobile(): void {
    if (window.innerWidth <= 768) {
      this.menuAbierto = false;
    }
  }

  cerrarSesion(): void {
    const confirmar = confirm('¿Estás seguro que deseas cerrar sesión?');

    if (confirmar) {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    }
  }
}