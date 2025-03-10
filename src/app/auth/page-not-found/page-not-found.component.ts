// src/app/shared/components/page-not-found/page-not-found.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './page-not-found.component.html'
  ,
  styleUrl : './page-not-found.component.scss'
})
export class PageNotFoundComponent {
  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }
}
