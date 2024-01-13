import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Observable, interval } from 'rxjs';
import { Track } from 'src/app/common/models/track.model';
import { TimersService } from 'src/app/common/services/timer.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-timer',
  standalone: true,
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  imports: [AsyncPipe, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule]
})
export class TimerComponent implements OnInit {
  @Input() dayId?: number;

  elapsed: number = 0;
  tick$ = interval(1000);
  tickSubscription: any = null;
  paused = false;
  isTracking = false;
  trackName = new FormControl<string>('');
  trackSelected?: Track;

  trackedTimes$?: Observable<Track[] | undefined>;

  constructor(private timersService: TimersService) {
  }

  ngOnInit(): void {
    console.log(this.dayId)
    this.trackedTimes$ = this.timersService.getTrackForDay$(this.dayId);
  }

  startTimer(): void {
    if (this.tickSubscription === null || this.paused) {
      this.isTracking = true;
      this.paused = false;
      this.tickSubscription = this.tick$.subscribe((x) => {
        this.elapsed++;
      });
    }
  }

  stopTimer(): void {
    if (this.tickSubscription !== null) {
      this.tickSubscription.unsubscribe();
      this.paused = true;
      this.isTracking = false;

    }
  }

  resetTimer(): void {
    if (this.tickSubscription !== null) {
      this.elapsed = 0;
      this.tickSubscription.unsubscribe();
      this.tickSubscription = null;
      this.isTracking = false;
    }

    this.trackSelected = undefined;
    this.trackName.reset();
    this.elapsed = 0;
  }

  convertToTime(elapsedSeconds: number): string {
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

  public saveTrack(): void {
    if (this.trackSelected !== undefined && this.trackName.value !== null) {
      this.trackSelected.elapsed = this.elapsed;
      this.trackSelected.name = this.trackName.value;
      this.timersService.updateTrack$(this.trackSelected).subscribe((x) => {
      });
    } else if (this.trackName.value !== '' && this.trackName.value !== null) {
      let newTrack: Track = {
        elapsed: this.elapsed,
        name: this.trackName.value || '',
        dayId: this.dayId
      }

      this.timersService.postTrack$(newTrack).subscribe(x => {
        this.trackedTimes$ = this.timersService.getTrackForDay$(this.dayId);
      });
    }

    this.resetTimer();
  }

  public selectTrack(track: Track): void {
    this.trackSelected = track;
    this.elapsed = track.elapsed;
    this.trackName.setValue(track.name);
    console.table(this.trackSelected);
  }

  public deleteTrack(): void {
    if (this.trackSelected !== undefined) {
      this.timersService.deleteTrack$(this.trackSelected).subscribe();
      this.trackedTimes$ = this.timersService.getTrackForDay$(this.dayId);
      this.trackSelected = undefined;
      this.elapsed = 0;
      this.trackName.reset();
    }
  }
}
