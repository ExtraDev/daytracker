import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, map, tap } from 'rxjs';
import { Day } from '../models/day.model';
import { Track } from '../models/track.model';
import { TracksService } from './tracks.service';

export interface FullDay {
    day?: Day,
    timer?: Track[]
}

@Injectable({
    providedIn: 'root'
})
export class DaysService {
    private baseUrl = 'http://localhost:25564/days'
    private date = new Date();
    private httpClient = inject(HttpClient);

    private timersSerivce = inject(TracksService);
    private destroyRef = inject(DestroyRef);

    private day: any = {};

    public getDays$(): Observable<ReadonlyArray<Day>> {
        return this.httpClient.get<Array<Day>>(this.baseUrl).pipe(
            map(days => {
                if (days) {
                    return days.sort((a, b) => {
                        return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
                    });
                } else {
                    return new Array<Day>();
                }
            })
        );
    }

    public getDateId$(dayId: number): Observable<Day | undefined> {
        return this.httpClient.get<Day | undefined>(`${this.baseUrl}?id=${dayId}`).pipe(
            tap(() => {
                this.timersSerivce.getTrackForDay$(dayId).pipe(
                    tap((tracks) => {
                        this.day['TIMER'] = tracks;
                    }),
                    takeUntilDestroyed(this.destroyRef)
                ).subscribe();
            })
        );
    }

    public postDay$(day: Day): Observable<Day> {
        return this.httpClient.post<Day>(this.baseUrl, day).pipe();
    }

    public updateDay$(day: Day): Observable<Day> {
        return this.httpClient.put<Day>(this.baseUrl, day).pipe();
    }

    public deleteDay$(day: Day): Observable<Day> {
        return this.httpClient.delete<Day>(`${this.baseUrl}/${day.id}`).pipe(
            tap(() => {
                console.log('Remove all data related to tad:', day.id);
            })
        );
    }

    public getActualDayId(): number {
        return parseInt(`${this.date.getDate()}${this.date.getMonth() + 1}${this.date.getFullYear()}`);
    }

    /**
     * Actual date as format: 14.01.2024
     * @returns string
     */
    public getActualDate(): string {
        return `${this.date.getDate()}-${this.date.getMonth() > 10 ? '' : '0'}${this.date.getMonth() + 1}-${this.date.getFullYear()}`;
    }
}
