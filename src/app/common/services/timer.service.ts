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
        return this.httpClient.get<Track[] | undefined>(`${this.baseUrl}?dayId=${dayId}`).pipe();
    }

    public postTrack$(track: Track): Observable<Track> {
        return this.httpClient.post<Track>(this.baseUrl, track).pipe();
    }

    public updateTrack$(track: Track): Observable<Track> {
        return this.httpClient.put<Track>(`${this.baseUrl}/${track.id}`, track).pipe();
    }

    public deleteTrack$(track: Track): Observable<Track> {
        return this.httpClient.delete<Track>(`${this.baseUrl}/${track.id}`).pipe();
    }
}
