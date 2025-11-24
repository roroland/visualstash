import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

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
  constructor(private http: HttpClient) {}

  getThemes(): Observable<Theme[]> {
    return this.http.get<ThemeResponse>('assets/data/themes.json?v=' + new Date().getTime()).pipe(
      map((res) => {
        if (!Array.isArray(res)) {
          return [];
        }
        if (res.length > 0 && Array.isArray(res[0])) {
          return (res as Theme[][]).flat();
        }
        return res as Theme[];
      })
    );
  }

  filterTags(themes: Theme[], tag: string): Theme[] {
    return themes.filter(theme => theme.tags?.includes(tag));
  }
}
