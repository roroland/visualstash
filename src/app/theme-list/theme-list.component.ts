import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeServiceService, Theme } from '../theme-service.service';
import { CardComponent } from '../card/card.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-theme-list',
  imports: [CommonModule, CardComponent, FormsModule],
  templateUrl: './theme-list.component.html'
})
export class ThemeListComponent {
  allThemes: Theme[] = [];
  themes: Theme[] = [];
  pageSize = 20;
  currentPage = 1;
  selectedTag: string | null = null;
  orderOptions = ['Rating (desc)','Más recientes', 'Más populares', 'A-Z', 'Z-A'];
  order: string = this.orderOptions[0];

  constructor(private themeService: ThemeServiceService) {
    this.themeService.getThemes().subscribe(data => {
      this.allThemes = data;
      this.themes = data;
    });
  }

  get pagedThemes(): Theme[] {
    const start = (this.currentPage - 1) * this.pageSize;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  orderBy(option: string) {
    this.order = option;
    // Implement sorting logic based on the selected option
    switch(option) {
      case 'Rating (desc)':
        this.themes.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'Más recientes':
        this.themes.sort((a, b) =>
          new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
        );
        break;
      case 'Más populares':
        this.themes.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
        break;
      case 'A-Z':
        this.themes.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Z-A':
        this.themes.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
  }

  onFilterByTag(tag: string) {
    this.selectedTag = tag;
    this.themes = this.themeService.filterTags(this.allThemes, tag);
    this.currentPage = 1;
  }

  clearTagFilter() {
    this.selectedTag = null;
    this.themes = this.allThemes;
    this.currentPage = 1;
  }
}
