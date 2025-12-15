import { HttpClient } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

export interface Theme {
  id: string;
  name: string;
  url?: string;
  image?: string;
  downloadUrl?: string;
  rating?: number;
  date?: string;
  size?: string;
  views?: number;
  comments?: number;
  country?: string;
  tags?: string[];
}

type ThemeResponse = Theme[] | Theme[][];

@Injectable({
  providedIn: 'root',
})
export class ThemeServiceService {
  readonly themes: Signal<Theme[]>;

  constructor(private http: HttpClient) {
    this.themes = toSignal(
      this.http.get<ThemeResponse>('assets/data/themes.json?v=' + new Date().getTime()).pipe(
        map((res) => {
          if (!Array.isArray(res)) {
            return [];
          }
          if (res.length > 0 && Array.isArray(res[0])) {
            return (res as Theme[][]).flat();
          }
          return res as Theme[];
        })
      ),
      { initialValue: [] }
    );
  }

  filterTags(themes: Theme[], tag: string): Theme[] {
    return themes.filter(theme => theme.tags?.includes(tag));
  }
}
