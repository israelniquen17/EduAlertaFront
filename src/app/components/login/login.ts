import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

export interface Usuario {
  id: number;
  usuario: string;
  rol: 'ADMIN' | 'DOCENTE' | 'PADRE';
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
    private cdr: ChangeDetectorRef
  ) {}

  login() {
    // Validar campos
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
        this.cdr.detectChanges();  // fuerza actualización inmediata
      }))
      .subscribe({
        next: (response) => {
          // Verificar si el usuario está activo
          if (response.estado !== 'ACTIVO') {
            this.error = 'Usuario inactivo, contacte con administración';
            this.cdr.detectChanges();
            return;
          }

          // Guardar usuario en localStorage
          localStorage.setItem('user', JSON.stringify(response));

          // Redirigir según rol
          switch (response.rol) {
            case 'ADMIN':
              this.router.navigate(['/dashboard']);
              break;
            case 'DOCENTE':
              this.router.navigate(['/docentes']);
              break;
            case 'PADRE':
              this.router.navigate(['/padres']);
              break;
            default:
              this.error = 'Rol no reconocido';
              break;
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          // Manejo de errores según el status HTTP
          if (err.status === 401 || err.status === 403) {
            this.error = err.error?.mensaje || 'Usuario o contraseña incorrecta';
          } else {
            this.error = 'Error de conexión con el servidor';
          }
          this.cdr.detectChanges();
        }
      });
  }
}