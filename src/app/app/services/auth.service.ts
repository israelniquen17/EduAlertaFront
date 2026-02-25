import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../../components/login/login';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  setUsuario(usuario: Usuario) {
    this.usuarioSubject.next(usuario);
    localStorage.setItem('user', JSON.stringify(usuario));
  }

  getUsuario(): Usuario | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  clearUsuario() {
    this.usuarioSubject.next(null);
    localStorage.removeItem('user');
  }
}