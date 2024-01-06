import { Component } from '@angular/core';
import { Observable, interval, startWith, take } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {
  elapsed: number = 0;
  tick$ = interval(1000);
  tickSubscription: any = null;
  pause = false;

  constructor() {
  }

  startTimer(): void {
    if (this.tickSubscription === null || this.pause) {
      this.pause = false;
      this.tickSubscription = this.tick$.subscribe((x) => {
        this.elapsed++;
      });
    }
  }

  stopTimer(): void {
    this.tickSubscription.unsubscribe();
    this.pause = true;
  }

  resetTimer(): void {
    this.elapsed = 0;
    this.tickSubscription = null;
  }

}
