import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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
    private baseUrl = 'http://localhost:3000/days'
    private date = new Date();
    private httpClient = inject(HttpClient);

    private timersSerivce = inject(TracksService);

    private day: any = {};

    public getDays$(): Observable<Day[] | undefined> {
        return this.httpClient.get<Day[] | undefined>(this.baseUrl).pipe(
            map(days => {
                // console.log(days);
                if (days) {
                    return days.filter(day => day.name !== undefined && day.name !== "")
                        .sort((dayA, dayB) => dayA.id! < dayB.id! ? -1 : 1);
                } else {
                    return undefined;
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
                    })
                ).subscribe();

                // console.log(this.day);
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
