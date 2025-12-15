import { Component, ViewChild, AfterViewChecked, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeServiceService, Theme } from '../theme-service.service';
import { CardComponent } from '../card/card.component';
import { FormsModule } from '@angular/forms';
import { DetailComponent } from '../detail/detail.component';
@Component({
  selector: 'app-theme-list',
  imports: [CommonModule, CardComponent, FormsModule, DetailComponent],
  templateUrl: './theme-list.component.html'
})
export class ThemeListComponent {
  @ViewChild('detailDialog') detailDialog!: DetailComponent;
  allThemes = signal<Theme[]>([]);
  themes = signal<Theme[]>([]);
  pageSize = 20;
  currentPage = signal(1);
  selectedTag = signal<string | null>(null);
  orderOptions = ['Más recientes', 'Más populares', 'Rating (desc)', 'A-Z', 'Z-A'];
  order = signal(this.orderOptions[0]);

  selectedDetail = signal<{ name: string; image: string } | null>(null);
  private pendingOpen = false;

  readonly pagedThemes = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.themes().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.themes().length / this.pageSize));

  onShowDetail(detail: { name: string; image: string }) {
    this.selectedDetail.set(detail);
    this.pendingOpen = true;
  }

  onDetailClosed() {
    this.selectedDetail.set(null);
  }

  ngAfterViewChecked(): void {
    if (this.pendingOpen && this.detailDialog) {
      this.detailDialog.open();
      this.pendingOpen = false;
    }
  }

  constructor(private themeService: ThemeServiceService) {
    effect(() => {
      const data = this.themeService.themes();
      this.allThemes.set(data);
      this.themes.set(data);
    });
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  orderBy(option: string) {
    this.order.set(option);
    this.themes.update((items) => {
      const list = items.slice();

      switch (option) {
        case 'Más recientes':
          return list.sort((a, b) =>
            new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
          );
        case 'Más populares':
          return list.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
        case 'Rating (desc)':
          return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        case 'A-Z':
          return list.sort((a, b) => a.name.localeCompare(b.name));
        case 'Z-A':
          return list.sort((a, b) => b.name.localeCompare(a.name));
        default:
          return list;
      }
    });
  }

  onFilterByTag(tag: string) {
    this.selectedTag.set(tag);
    this.themes.set(this.themeService.filterTags(this.allThemes(), tag));
    this.currentPage.set(1);
  }

  clearTagFilter() {
    this.selectedTag.set(null);
    this.themes.set(this.allThemes());
    this.currentPage.set(1);
  }
}
