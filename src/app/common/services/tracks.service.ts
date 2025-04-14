import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Track } from '../models/track.model';

@Injectable({
    providedIn: 'root'
})
export class TracksService {
    private baseUrl = 'http://localhost:25564/tracks'
    private httpClient = inject(HttpClient);

    protected selectedTracks$ = new Subject<Track[] | undefined>;

    public getTracks$(): Observable<Track[] | undefined> {
        return this.httpClient.get<Track[] | undefined>(this.baseUrl).pipe(
            tap(tracks => this.selectedTracks$.next(tracks))
        );
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
