import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Day } from '../models/day.model';


@Injectable({
    providedIn: 'root'
})
export class DaysService {
    private baseUrl = 'http://localhost:3000/days'
    private date = new Date();

    constructor(private httpClient: HttpClient) { }

    public getDays$(): Observable<Day[] | undefined> {
        return this.httpClient.get<Day[] | undefined>(this.baseUrl).pipe();
    }

    public getDateId$(dayId: number): Observable<Day | undefined> {
        return this.httpClient.get<Day | undefined>(`${this.baseUrl}?id=${dayId}`).pipe(
            map(day => {
                if (Object.keys(day || {}).length === 0) {
                    return undefined;
                }
                return day;
            })
        );
    }

    public postDay$(day: Day): Observable<Day> {
        return this.httpClient.post<Day>(this.baseUrl, day).pipe();
    }

    public updateDay$(day: Day): Observable<Day> {
        return this.httpClient.put<Day>(this.baseUrl, day).pipe();
    }

    public getActualDayId(): number {
        return parseInt(`${this.date.getDate()}${this.date.getMonth() + 1}${this.date.getFullYear()}`);
    }

    public getActualDate(): string {
        return `${this.date.getDate()}-${this.date.getMonth() > 10 ? '' : '0'}${this.date.getMonth() + 1}-${this.date.getFullYear()}`;
    }
}
