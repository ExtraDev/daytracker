import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, interval, startWith, take } from 'rxjs';
import { Track } from 'src/app/common/models/track.model';
import { TimersService } from 'src/app/common/services/timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  @Input() dayId?: number;

  elapsed: number = 0;
  tick$ = interval(1000);
  tickSubscription: any = null;
  paused = false;
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
    }
  }

  resetTimer(): void {
    if (this.tickSubscription !== null) {
      this.elapsed = 0;
      this.tickSubscription.unsubscribe();
      this.tickSubscription = null;
    }

    this.trackSelected = undefined;
    this.trackName.setValue("");
  }

  convertToTime(elapsedSeconds: number): string {
    let hours = Math.floor(elapsedSeconds / 3600);
    let minutes = Math.floor((elapsedSeconds - (hours * 3600)) / 60);
    let seconds = elapsedSeconds % 60;

    let resHours = ""
    if (hours < 10) { resHours = "0" + hours }
    else { resHours = hours.toString() }


    let resMinutes = ""
    if (minutes < 10) { resMinutes = "0" + minutes }
    else { resMinutes = minutes.toString() }

    let resSeconds = ""
    if (seconds < 10) { resSeconds = "0" + seconds }
    else { resSeconds = seconds.toString() }

    return resHours + ":" + resMinutes + ":" + resSeconds;
  }

  public saveTrack(): void {
    if (this.trackName.value !== '' && this.trackName.value !== null) {
      let newTrack: Track = {
        elapsed: this.elapsed,
        name: this.trackName.value || '',
        dayId: this.dayId
      }

      this.timersService.postTrack$(newTrack).subscribe(x => {
        this.trackedTimes$ = this.timersService.getTrackForDay$(this.dayId);
      });
    }
  }

  // public saveTrack(): void {
  //   if (this.trackSelected !== undefined && this.trackName.value !== null) {
  //     this.trackedTimes[this.trackSelected.trackId - 1].elapsed = this.elapsed;
  //     this.trackedTimes[this.trackSelected.trackId - 1].name = this.trackName.value;
  //     this.trackName.reset();
  //   } else if (this.trackName.value !== '' && this.trackName.value !== null) {
  //     let newTrack: Track = {
  //       trackId: this.trackedTimes.length + 1,
  //       elapsed: this.elapsed,
  //       name: this.trackName.value || ''
  //     }

  //     this.trackedTimes.push(
  //       newTrack
  //     )

  //     this.trackName.reset();
  //   } else {

  //   }
  // }

  public selectTrack(track: Track): void {
    this.trackSelected = track;
    this.elapsed = track.elapsed;
    this.trackName.setValue(track.name);
    console.table(this.trackSelected);
  }
}
