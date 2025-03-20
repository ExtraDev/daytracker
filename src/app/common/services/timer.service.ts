import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root' // 👈 Fournit le service au niveau de l'application
})
export class TimerService {
    private ticker$ = interval(1000);
    private tickerSubscription$: Subscription | undefined;
    private elapsedTime = 0;
    private isStated = false;

    public start(): void {
        if (!this.tickerSubscription$) {
            this.tickerSubscription$ = this.ticker$.subscribe(() => {
                this.elapsedTime++;
            });
            this.isStated = true;
        }
    }

    public stop(): void {
        if (this.tickerSubscription$) {
            this.tickerSubscription$.unsubscribe();
            this.tickerSubscription$ = undefined;
            this.isStated = false;
        }
    }

    public reset(): void {
        this.stop();
        this.elapsedTime = 0;
    }

    public setElapedTime(elapsedTime: number): void {
        this.elapsedTime = elapsedTime;
    }

    public getElapsedTime(): number {
        return this.elapsedTime;
    }

    public getTimer(): string {
        return this.convertSecondesToStringTime(this.elapsedTime);
    }

    public convertToTime(elapsed: number): string {
        return this.convertSecondesToStringTime(elapsed);
    }

    private convertSecondesToStringTime(elapsed: number) {
        let hours = Math.floor(elapsed / 3600);
        let minutes = Math.floor((elapsed - (hours * 3600)) / 60);
        let seconds = elapsed % 60;

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

