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

    bigImage(theme: Theme): string {
    if (!theme.image) {
      return '';
    }
    return theme.image.replace(/\/1\//, '/');
  }
  emitFilterByTag(tag: string) {
    this.filterByTag.emit(tag);
  }
}
