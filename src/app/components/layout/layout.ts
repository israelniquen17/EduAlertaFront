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

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarSesion() {
    const confirmar = confirm('¿Estás seguro que deseas cerrar sesión?');

    if (confirmar) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
}