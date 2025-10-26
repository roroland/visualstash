import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';

export interface Theme {
  id: string;
  name: string;
  description: string;
}


@Injectable({
  providedIn: 'root'
})
export class ThemeServiceService {

  constructor(private http: HttpClient) { }

  getThemes(): Observable<Theme[]> {
    return this.http.get<Theme[]>('/assets/data/themes.json').pipe(
      map(res => res.flat())
    );
  }
}
