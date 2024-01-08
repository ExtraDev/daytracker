import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Track } from '../models/track.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimersService {
  private baseUrl = 'http://localhost:3000/tracks'

  constructor(private httpClient: HttpClient) { }

  public getTracks$(): Observable<Track[] | undefined> {
    return this.httpClient.get<Track[] | undefined>(this.baseUrl).pipe();
  }

  public getTrackForDay$(dayId?: number): Observable<Track[] | undefined> {
    console.log(`${this.baseUrl}?dayId=${dayId}`);
    return this.httpClient.get<Track[] | undefined>(`${this.baseUrl}?dayId=${dayId}`).pipe(
      tap(x => console.log(x))
    );
  }

  public postTrack$(note: Track): Observable<Track> {
    return this.httpClient.post<Track>(this.baseUrl, note).pipe();
  }

  public updateTrack$(note: Track): Observable<Track> {
    return this.httpClient.put<Track>(this.baseUrl, note).pipe();
  }
}
