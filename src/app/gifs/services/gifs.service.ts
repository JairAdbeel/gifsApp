import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interface';

const API_KEY = 'Bf368hWv0ca7OhzAXQVHFyXiQCIyGsNH';
const LIMIT   = 10;

@Injectable({providedIn: 'root'})
export class GifsService {
  public gifList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs/search';


  constructor(
    private http: HttpClient
  ) {
    this.loadLocalStorage();
    if ( this._tagsHistory.length > 0 ) { this.searchTag(this._tagsHistory[0]) };
   }

  get tagsHistory() {
    return this._tagsHistory;
  }

  private validateHistory(tag: string): void {
    if ( tag.length === 0) return;
    tag = tag.toLowerCase();
    if ( this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag );
    }
    if( this._tagsHistory.length > 9 ) { this._tagsHistory.pop(); }
    this._tagsHistory.unshift( tag );
  }

  searchTag( tag: string ): void {
    this.validateHistory(tag);
    this.saveLocalStorage ();
    const params = new HttpParams()
    .set('api_key', API_KEY)
    .set('limit', LIMIT)
    .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}`, { params })
    .subscribe( response => {
      this.gifList = response.data;
    })
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if ( !localStorage.getItem('history') ) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
  }
}
