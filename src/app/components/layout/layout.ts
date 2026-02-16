import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // 👈 IMPORTAR

@Component({
  selector: 'app-layout',
  standalone: true, // 👈 ESTO ES OBLIGATORIO
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule  // 👈 NECESARIO PARA router-outlet y routerLink
  ]
})
export class LayoutComponent {

  menuAbierto = false;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

}
