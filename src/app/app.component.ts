import { Component, inject } from '@angular/core';
import { NotesService } from './common/services/note.service';
import { TodosService } from './common/services/todo.service';
import { TimersService } from './common/services/timer.service';
import { TodoComponent } from './widgets/todo/todo.component';
import { TimerComponent } from './widgets/timer/timer.component';
import { MatIconModule } from '@angular/material/icon';
import { NoteComponent } from './widgets/note/note.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DateComponent } from './widgets/date/date.component';
import { DaysService } from './common/services/day.service';
import { Day } from './common/models/day.model';
import { Note } from './common/models/note.model';
import { Todo } from './common/models/todo.model';
import { Track } from './common/models/track.model';
import { Observable, map, tap } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import {
    MatDialog,
    MatDialogModule,
} from '@angular/material/dialog';
import { NewdayDialogComponent } from './common/dialog/newday-dialog/newday-dialog.component';

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
    private notesService = inject(NotesService);
    private todosService = inject(TodosService);
    private timersService = inject(TimersService);

    public day?: Day;

    public notes$?: Observable<ReadonlyArray<Note> | undefined>;
    public todolist$?: Observable<ReadonlyArray<Todo> | undefined>;
    public timers$?: Observable<ReadonlyArray<Track> | undefined>;

    public getDays$ = this.daysService.getDays$().pipe();

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
                    tap(() => {
                        this.getDays$ = this.daysService.getDays$().pipe();
                    })
                ).subscribe();
            }
        })

    }

    selectDay(day: Day): void {
        console.log(day);
    }
}
