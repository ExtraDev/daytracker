import { AsyncPipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, Subscription, filter, interval, map } from 'rxjs';
import { Track } from 'src/app/common/models/track.model';
import { TimerService } from 'src/app/common/services/timer.service';
import { TracksService } from 'src/app/common/services/tracks.service';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
    imports: [AsyncPipe, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule]
})
export class TimerComponent implements OnChanges, OnInit {
    @Input() dayId?: number;

    private tracksService = inject(TracksService);
    private timerService = inject(TimerService);

    protected trackSaved = true;
    tick$: Observable<number> = interval(1000);

    tickSubscription?: Subscription | undefined;
    trackName = new FormControl<string>('');

    trackSelected?: Track;
    trackedTimes$?: Observable<Track[] | undefined> = this.tracksService.getTrackForDay$(this.dayId);

    public totalElapsed = signal(0);

    ngOnInit(): void {
        if ((window as any).electron) {
            (window as any).electron.onStartTimer(() => this.startTimer());
            (window as any).electron.onPauseTimer(() => this.pauseTimer());
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Suis pas fan de ça, voir comment s'en passer
        if ('dayId' in changes) {
            this.trackedTimes$ = this.tracksService.getTrackForDay$(this.dayId);
            this.computeTotalEspased();
        }
    }

    startTimer(): void {
        this.timerService.start();
        this.trackSaved = false;
    }

    pauseTimer(): void {
        this.timerService.stop();
        this.updateTray();
    }

    resetTimer(): void {
        this.timerService.reset();

        this.trackSelected = undefined;
        this.trackName.reset();
        this.computeTotalEspased();
        this.updateTray();
    }


    public saveTrack(): void {
        /* CREATE */
        if (
            this.trackName.value !== '' &&
            this.trackName.value !== null &&
            this.trackSelected === undefined
        ) {
            let newTrack: Track = {
                elapsed: this.timerService.getElapsedTime(),
                name: this.trackName.value || '',
                dayId: this.dayId
            }

            this.tracksService.postTrack$(newTrack).subscribe(track => {
                console.log(track);
                this.trackedTimes$ = this.tracksService.getTrackForDay$(this.dayId);
            });
        }

        /* SAVE */
        if (
            this.trackSelected !== undefined &&
            this.trackName.value !== null
        ) {
            this.trackSelected.elapsed = this.timerService.getElapsedTime(),
                this.trackSelected.name = this.trackName.value;

            this.tracksService.updateTrack$(this.trackSelected).subscribe();

        }

        this.trackSaved = true;
        this.computeTotalEspased();
        this.resetTimer();
    }

    public selectTrack(track: Track): void {
        this.stopTickSubscription();

        this.trackSelected = track;

        this.timerService.setElapedTime(track.elapsed);
        this.trackName.setValue(track.name);

    }

    public deleteTrack(): void {
        if (this.trackSelected !== undefined) {
            this.tracksService.deleteTrack$(this.trackSelected).subscribe((x: Track) => {
                this.trackedTimes$ = this.tracksService.getTrackForDay$(this.dayId);
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
        return this.timerService.convertToTime(elapsedSeconds);
    }

    public getTimer(): string {
        this.updateTray();
        return this.timerService.getTimer();
    }

    private updateTray() {
        if ((window as any).electron) {
            (window as any).electron.updateTimer(this.convertToTime(this.timerService.getElapsedTime()));
        }
    }
}