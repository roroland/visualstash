import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeListComponent } from './theme-list/theme-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ThemeListComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'visualstash';
}
