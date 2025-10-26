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

  constructor(private themeService: ThemeServiceService) {
    this.themeService.getThemes().subscribe(data => {
      this.themes = data;
      console.log(this.themes);
    });
  }
}
