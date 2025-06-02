import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, Subscription, filter, map, tap } from 'rxjs';
import { ValidationDialogComponent } from 'src/app/common/dialog/validation-dialog/validation-dialog.component';
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
    @Input() pageName?: string;

    public trackName = new FormControl<string>('');
    public trackSelected?: Track;

    protected trackSaved = true;

    private tickSubscription?: Subscription | undefined;
    private tracksService = inject(TracksService);
    private timerService = inject(TimerService);
    private ngZone = inject(NgZone);
    private dialog = inject(MatDialog);
    private destroyRef = inject(DestroyRef);


    trackedTimes$?: Observable<ReadonlyArray<Track> | undefined> = this.tracksService.getTrackForDay$(this.dayId).pipe(
        tap(tracks => {
            if ((window as any).electron) {
                (window as any).electron.updateTracks(tracks);
            }
        })
    );

    public totalElapsed = signal(0);

    public ngOnInit(): void {
        if ((window as any).electron) {

            (window as any).electron.onStartTimer(() => {
                this.ngZone.run(() => this.startTimer());
            });

            (window as any).electron.onPauseTimer(() => {
                this.ngZone.run(() => this.pauseTimer());
            });

            (window as any).electron.onSaveTimer(() => {
                this.ngZone.run(() => this.saveTrack());
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('dayId' in changes) {
            this.trackedTimes$ = this.tracksService.getTrackForDay$(this.dayId);
            this.computeTotalEspased();
        }
    }

    public startTimer(): void {
        this.timerService.start();
        this.trackSaved = false;
        this.updateTray();
    }

    public pauseTimer(): void {
        this.timerService.stop();
        this.updateTray();
    }

    public resetTimer(): void {
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

            this.tracksService.postTrack$(newTrack).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe(_ => {
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

            this.tracksService.updateTrack$(this.trackSelected).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe();

        }

        this.trackSaved = true;
        this.computeTotalEspased();
        this.resetTimer();
    }

    public selectTrack(track: Track): void {
        if (this.timerService.isStated()) {
            const dialogRef = this.dialog.open(ValidationDialogComponent, {
                data: 'Voulez-vous vraiment changer de tâche sans sauvegarder?',
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.stopTickSubscription();

                    this.trackSelected = track;

                    this.timerService.setElapedTime(track.elapsed);
                    this.trackName.setValue(track.name);
                }
            });
        } else {
            this.stopTickSubscription();

            this.trackSelected = track;

            this.timerService.setElapedTime(track.elapsed);
            this.trackName.setValue(track.name);
        }
    }

    public deleteTrack(): void {
        if (this.trackSelected !== undefined) {
            const dialogRef = this.dialog.open(ValidationDialogComponent, {
                data: 'Voulez-vous supprimer la tâche ?',
            });

            dialogRef.afterClosed()
                .pipe(
                    filter(Boolean),
                    tap(() => {
                        if (this.trackSelected !== undefined) {
                            this.tracksService.deleteTrack$(this.trackSelected).subscribe(() => {
                                this.trackedTimes$ = this.tracksService.getTrackForDay$(this.dayId);
                                this.resetTimer();
                            });
                        }
                    }),
                    takeUntilDestroyed(this.destroyRef)
                ).subscribe();
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
            takeUntilDestroyed(this.destroyRef)
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