import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Theme, ThemeServiceService } from '../theme-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[app-card]',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  @Input() theme!: Theme;
  @Output() filterByTag = new EventEmitter<string>();

  private readonly tagColorClasses = [
    'bg-lime-700',
    'bg-emerald-700',
    'bg-sky-700',
    'bg-purple-700',
    'bg-amber-600',
    'bg-rose-700',
    'bg-violet-700',
    'bg-cyan-700',
    'bg-fuchsia-700',
    'bg-indigo-700'
  ];

  bigImage(theme: Theme): string {
    if (!theme.image) {
      return '';
    }
    return theme.image.replace(/\/1\//, '/');
  }

  emitFilterByTag(tag: string) {
    this.filterByTag.emit(tag);
  }

  tagColorClass(tag: string): string {
    const index = Math.abs(this.hashTag(tag)) % this.tagColorClasses.length;
    return this.tagColorClasses[index];
  }

  private hashTag(tag: string): number {
    return Array.from(tag).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
  }
}
