import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeServiceService, Theme } from '../theme-service.service';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-theme-list',
  imports: [CommonModule, CardComponent],
  templateUrl: './theme-list.component.html'
})
export class ThemeListComponent {
  allThemes: Theme[] = [];
  themes: Theme[] = [];
  pageSize = 20;
  currentPage = 1;
  selectedTag: string | null = null;
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
