import { Component, Input } from '@angular/core';
import { Theme } from '../theme-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  @Input() theme!: Theme;

    bigImage(theme: Theme): string {
    if (!theme.image) {
      return '';
    }
    return theme.image.replace(/\/1\//, '/');
  }

}
