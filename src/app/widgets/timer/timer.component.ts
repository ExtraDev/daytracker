import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Observable, Subscription, filter, interval, map, tap } from 'rxjs';
import { TimersService } from 'src/app/common/services/timer.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { Track } from 'src/app/common/models/track.model';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
    imports: [AsyncPipe, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule]
})
export class TimerComponent implements OnChanges {
    @Input() dayId?: number;

    private timersService = inject(TimersService);

    elapsed: number = 0;
    tick$: Observable<number> = interval(1000);

    tickSubscription?: Subscription | undefined;
    trackName = new FormControl<string>('');

    trackSelected?: Track;
    trackedTimes$?: Observable<Track[] | undefined> = this.timersService.getTrackForDay$(this.dayId);

    private startTime: number | undefined;
    MAX_DELTA_SECONDS = 10;
    DELAY_TO_CHECK = 5;

    public totalElapsed = signal(0);

    ngOnChanges(changes: SimpleChanges): void {
        // Suis pas fan de ça, voir comment s'en passer
        if ('dayId' in changes) {
            this.trackedTimes$ = this.timersService.getTrackForDay$(this.dayId);
            this.computeTotalEspased();
        }
    }

    startTimer(): void {
        if (this.tickSubscription === undefined) {
            if (this.startTime === undefined) {
                this.startTime = Date.now();
            }

            this.tickSubscription = this.tick$.subscribe(() => {
                if (this.elapsed % this.DELAY_TO_CHECK === 0) {

                    let millis = Date.now() - this.startTime!
                    let tmpElapsed = Math.floor(millis / 1000);

                    /* Checker le différentiel de temps. 
                     * S'il correspond plus ou moins, ajuster.
                     */
                    if (Math.abs(tmpElapsed - this.elapsed) >= this.MAX_DELTA_SECONDS) {
                        this.elapsed = tmpElapsed;
                    }
                }

                this.elapsed++;
            });
        }
    }

    pauseTimer(): void {
        if (this.tickSubscription !== undefined) {
            this.stopTickSubscription();
        }
    }

    resetTimer(): void {
        if (this.tickSubscription !== undefined) {
            this.elapsed = 0;
            this.stopTickSubscription();
        }

        this.startTime = undefined;
        this.trackSelected = undefined;
        this.trackName.reset();
        this.elapsed = 0;
        this.computeTotalEspased();
    }


    public saveTrack(): void {
        if (
            this.trackName.value !== '' &&
            this.trackName.value !== null &&
            this.trackSelected === undefined
        ) {
            let newTrack: Track = {
                elapsed: this.elapsed,
                name: this.trackName.value || '',
                dayId: this.dayId
            }

            this.timersService.postTrack$(newTrack).subscribe(track => {
                console.log(track);
                this.trackedTimes$ = this.timersService.getTrackForDay$(this.dayId);
            });
        }

        if (
            this.trackSelected !== undefined &&
            this.trackName.value !== null
        ) {
            this.trackSelected.elapsed = this.elapsed;
            this.trackSelected.name = this.trackName.value;

            this.timersService.updateTrack$(this.trackSelected).subscribe();

        }

        this.computeTotalEspased();
        this.resetTimer();
    }

    public selectTrack(track: Track): void {
        this.stopTickSubscription();

        this.trackSelected = track;

        this.elapsed = track.elapsed;
        this.trackName.setValue(track.name);

        this.startTime = Date.now() - this.elapsed * 1000;
    }

    public deleteTrack(): void {
        if (this.trackSelected !== undefined) {
            this.timersService.deleteTrack$(this.trackSelected).subscribe((x: Track) => {
                this.trackedTimes$ = this.timersService.getTrackForDay$(this.dayId);
                this.resetTimer();
            });
        }
    }

    public stopTickSubscription(): void {
        this.tickSubscription?.unsubscribe();
        this.tickSubscription = undefined;
    }

    private computeTotalEspased(): void {
        this.trackedTimes$?.pipe(
            filter(Boolean),
            map(tracks => {
                this.totalElapsed.set(tracks.reduce((acc, track) => acc + track.elapsed, 0))
            }),
        ).subscribe();
    }

    public convertToTime(elapsedSeconds: number): string {
        let hours = Math.floor(elapsedSeconds / 3600);
        let minutes = Math.floor((elapsedSeconds - (hours * 3600)) / 60);
        let seconds = elapsedSeconds % 60;

        let resHours = ""
        if (hours < 10) resHours = "0" + hours
        else resHours = hours.toString()

        let resMinutes = ""
        if (minutes < 10) { resMinutes = "0" + minutes }
        else { resMinutes = minutes.toString() }

        let resSeconds = ""
        if (seconds < 10) { resSeconds = "0" + seconds }
        else { resSeconds = seconds.toString() }

        return resHours + ":" + resMinutes + ":" + resSeconds;
    }
}