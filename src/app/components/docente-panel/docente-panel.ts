import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-docente-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './docente-panel.html',
  styleUrls: ['./docente-panel.css']
})
export class DocentePanelComponent implements OnInit {
  usuario: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const data = localStorage.getItem('user');
    this.usuario = data ? JSON.parse(data) : null;
  }

  irAAlumnos(): void {
    this.router.navigate(['/alumnos']);
  }

  irAEscaner(): void {
    this.router.navigate(['/lector-qr']);
  }

  get nombreDocente(): string {
    return this.usuario?.usuario || 'Docente';
  }
}