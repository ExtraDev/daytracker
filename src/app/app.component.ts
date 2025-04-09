import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialog,
    MatDialogModule,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, Subject, tap } from 'rxjs';
import { NewdayDialogComponent } from './common/dialog/newday-dialog/newday-dialog.component';
import { ValidationDialogComponent } from './common/dialog/validation-dialog/validation-dialog.component';
import { Day } from './common/models/day.model';
import { DaysService, FullDay } from './common/services/day.service';
import { TimerService } from './common/services/timer.service';
import { DateComponent } from './widgets/date/date.component';
import { NoteComponent } from './widgets/note/note.component';
import { TimerComponent } from './widgets/timer/timer.component';
import { TodoComponent } from './widgets/todo/todo.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [AsyncPipe, MatButtonModule, MatIconModule, TodoComponent, TimerComponent, NoteComponent, DateComponent, MatSidenavModule, MatToolbarModule, MatListModule, MatDividerModule, MatDialogModule, MatTabsModule]
})
export class AppComponent {
    title = 'daytracker';

    private dialog = inject(MatDialog);
    private daysService = inject(DaysService);

    public daySelected?: Day;

    public daySubject$ = new Subject<Day>();
    public getFullDays$ = new Observable<FullDay[] | undefined>();

    public getDays$ = this.daysService.getDays$();

    private timerService = inject(TimerService);

    constructor() {
        this.daySubject$.pipe(
            tap((day) => {
                this.timerService.reset();
                this.daySelected = day;
            }),
        ).subscribe();
    }

    public addWidget(): void {
        console.log("Add widget");
    }

    public newDay(): void {
        const dialogRef = this.dialog.open(NewdayDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.value) {
                this.daysService.postDay$(
                    { name: result.value, date: new Date().toISOString() }
                ).pipe(
                    tap(() => this.getDays$ = this.daysService.getDays$().pipe())
                ).subscribe();
            }
        })
    }

    public deleteDay(): void {
        const dialogRef = this.dialog.open(ValidationDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result && this.daySelected) {
                console.log(result, this.daySelected?.id);
                this.daysService.deleteDay$(this.daySelected).pipe(
                    tap(() => {
                        this.getDays$ = this.daysService.getDays$().pipe();
                        this.daySelected = undefined;
                    })
                ).subscribe();
            }
        });
    }
}
