import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeServiceService, Theme } from '../theme-service.service';

@Component({
  selector: 'app-theme-list',
  imports: [CommonModule],
  templateUrl: './theme-list.component.html'
})
export class ThemeListComponent {
  themes: Theme[] = [];
  pageSize = 20;
  currentPage = 1;
  constructor(private themeService: ThemeServiceService) {
    this.themeService.getThemes().subscribe(data => {
      this.themes = data;
      console.log(this.themes);
    });
  }

  bigImage(theme: Theme): string {
    if (!theme.image) {
      return '';
    }
    return theme.image.replace(/\/1\//, '/');
  }

  get pagedThemes(): Theme[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.themes.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.themes.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
