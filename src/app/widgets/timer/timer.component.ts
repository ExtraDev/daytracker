import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Observable, Observer, Subscribable, Subscription, interval } from 'rxjs';
import { TimersService } from 'src/app/common/services/timer.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { Track } from 'src/app/common/models/track.model';

@Component({
	selector: 'app-timer',
	standalone: true,
	templateUrl: './timer.component.html',
	styleUrls: ['./timer.component.scss'],
	imports: [AsyncPipe, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule]
})
export class TimerComponent implements OnInit {
	@Input() dayId?: number;

	private timersService = inject(TimersService);

	elapsed: number = 0;
	tick$: Observable<number> = interval(1000);
	tickSubscription?: Subscription | undefined; // Trouver un type adéquat. Pour moi, ce devrait être un Subscription<number>
	trackName = new FormControl<string>('');
	trackSelected?: Track;

	trackedTimes$?: Observable<Track[] | undefined>;

	constructor() {
	}

	ngOnInit(): void {
		this.trackedTimes$ = this.timersService.getTrackForDay$(this.dayId);
	}

	startTimer(): void {
		if (this.tickSubscription === undefined) {
			this.tickSubscription = this.tick$.subscribe(() => this.elapsed++);
		}
	}

	pauseTimer(): void {
		if (this.tickSubscription !== undefined) {
			this.tickSubscription.unsubscribe();
			this.tickSubscription = undefined;
		}
	}

	resetTimer(): void {
		if (this.tickSubscription !== undefined) {
			this.elapsed = 0;
			this.tickSubscription.unsubscribe();
			this.tickSubscription = undefined;
		}

		this.trackSelected = undefined;
		this.trackName.reset();
		this.elapsed = 0;
	}


	public saveTrack(): void {
		if (
			this.trackName.value !== '' &&
			this.trackName.value !== null
		) {
			let newTrack: Track = {
				elapsed: this.elapsed,
				name: this.trackName.value || '',
				dayId: this.dayId
			}

			this.timersService.postTrack$(newTrack).subscribe(x => {
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

		this.resetTimer();
	}

	public selectTrack(track: Track): void {
		this.trackSelected = track;
		this.elapsed = track.elapsed;
		this.trackName.setValue(track.name);
	}

	public deleteTrack(): void {
		if (this.trackSelected !== undefined) {
			this.timersService.deleteTrack$(this.trackSelected).subscribe((x: Track) => {
				this.trackedTimes$ = this.timersService.getTrackForDay$(this.dayId);
				this.resetTimer();
			}
			);
		}
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
