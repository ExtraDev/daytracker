import { Component, inject } from '@angular/core';
import { TodoComponent } from './widgets/todo/todo.component';
import { TimerComponent } from './widgets/timer/timer.component';
import { MatIconModule } from '@angular/material/icon';
import { NoteComponent } from './widgets/note/note.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DateComponent } from './widgets/date/date.component';
import { DaysService, FullDay } from './common/services/day.service';
import { Day } from './common/models/day.model';
import { Observable, Subject, tap } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import {
    MatDialog,
    MatDialogModule,
} from '@angular/material/dialog';
import { NewdayDialogComponent } from './common/dialog/newday-dialog/newday-dialog.component';
import { ValidationDialogComponent } from './common/dialog/validation-dialog/validation-dialog.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [AsyncPipe, MatButtonModule, MatIconModule, TodoComponent, TimerComponent, NoteComponent, DateComponent, MatSidenavModule, MatToolbarModule, MatListModule, MatDividerModule, MatDialogModule]
})
export class AppComponent {
    title = 'daytracker';

    private dialog = inject(MatDialog);
    private daysService = inject(DaysService);

    public daySelected?: Day;

    public daySubject$ = new Subject<Day>();
    public getFullDays$ = new Observable<FullDay[] | undefined>();

    public getDays$ = this.daysService.getDays$().pipe();

    constructor() {
        this.daySubject$.pipe(
            tap((day) => this.daySelected = day)
        ).subscribe();

        // this.getFullDays$ = this.daysService.getDaysAndTimer$().pipe(
        //     tap(days => console.log("full days", days))
        // );
    }

    addWidget(): void {
        console.log("Add widget");
    }

    newDay(): void {
        const dialogRef = this.dialog.open(NewdayDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.value) {
                this.daysService.postDay$(
                    { name: result.value, date: this.daysService.getActualDate() }
                ).pipe(
                    tap(() => this.getDays$ = this.daysService.getDays$().pipe())
                ).subscribe();
            }
        })
    }

    deleteDay(): void {
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
