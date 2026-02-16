import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
  
    <router-outlet></router-outlet>
  `,
  styles: [`
    nav button {
      margin-right: 10px;
      padding: 8px 12px;
      cursor: pointer;
    }
  `]
})
export class App {}
