import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

export interface Usuario {
  id: number;
  usuario: string;
  rol: 'ADMIN' | 'DOCENTE';
  estado: 'ACTIVO' | 'INACTIVO';
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  email: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef   // 🔥 agregado
  ) {}

  login() {

    if (!this.email || !this.password) {
      this.error = 'Complete todos los campos';
      return;
    }

    this.error = '';
    this.loading = true;

    const body = {
      usuario: this.email,
      password: this.password
    };

    this.http.post<Usuario>('http://localhost:8080/api/auth/login', body)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();  // 🔥 fuerza actualización inmediata
      }))
      .subscribe({
       next: (response) => {

  localStorage.setItem('user', JSON.stringify(response));

  if (response.rol === 'ADMIN') {
    this.router.navigate(['/dashboard']);
  } else if (response.rol === 'DOCENTE') {
    this.router.navigate(['/docente']);
  }

},
        error: (err) => {

          if (err.status === 401) {
            this.error = err.error?.mensaje || 'Usuario o contraseña incorrecta';
          } else {
            this.error = 'Error de conexión con el servidor';
          }

          this.cdr.detectChanges(); // 🔥 fuerza actualización inmediata
        }
      });
  }
}