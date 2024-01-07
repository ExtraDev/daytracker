import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, interval, startWith, take } from 'rxjs';

export interface TrackedTime {
  elapsed: number,
  name: string,
}

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {
  elapsed: number = 0;
  tick$ = interval(1000);
  tickSubscription: any = null;
  paused = false;
  trackName = new FormControl<string>('');

  trackedTime: TrackedTime[] = [
    {
      "elapsed": 100,
      "name": "Ajout d'une nouvelle fonctionnalité"
    }, {
      "elapsed": 3600,
      "name": "Ajout d'une deuxième fonctionnalité"
    }, {
      "elapsed": 600,
      "name": "Répondre aux emails"
    }
  ]

  constructor() {
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

  public save(): void {
    if (this.trackName.value !== '' && this.trackName.value !== null) {
      let newTrack: TrackedTime = {
        elapsed: this.elapsed,
        name: this.trackName.value || ''
      }

      this.trackedTime.push(
        newTrack
      )

      this.trackName.reset();
    }
  }
}
