import { Component, inject } from '@angular/core';
import { NotesService } from './common/services/note.service';
import { TodosService } from './common/services/todo.service';
import { TimersService } from './common/services/timer.service';
import { TodoComponent } from './widgets/todo/todo.component';
import { TimerComponent } from './widgets/timer/timer.component';
import { MatIconModule } from '@angular/material/icon';
import { NoteComponent } from './widgets/note/note.component';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DateComponent } from './widgets/date/date.component';
import { DaysService } from './common/services/day.service';
import { Day } from './common/models/day.model';
import { Note } from './common/models/note.model';
import { Todo } from './common/models/todo.model';
import { Track } from './common/models/track.model';
import { Observable, tap } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [AsyncPipe, MatButtonModule, MatIconModule, TodoComponent, TimerComponent, NoteComponent, DateComponent]
})
export class AppComponent {
    title = 'daytracker';

    private daysService = inject(DaysService);
    private notesService = inject(NotesService);
    private todosService = inject(TodosService);
    private timersService = inject(TimersService);

    public day?: Day;

    public notes$?: Observable<Note[] | undefined>;
    public todolist$?: Observable<Todo[] | undefined>;
    public timers$?: Observable<Track[] | undefined>;

    constructor() {
        console.log(this.daysService.getActualDayId());
        // check the actual date
        this.daysService.getDateId$(this.daysService.getActualDayId()).pipe(
            tap(day => console.log("My day: ", day))
        );

        this.daysService.getDateId$(this.daysService.getActualDayId()).subscribe(day => {
            if (day) {
                this.day = day;
            } else {
                this.daysService.postDay$({
                    id: this.daysService.getActualDayId(),
                    date: this.daysService.getActualDate()
                }).subscribe(day => {
                    this.day = day;
                });
            }

            console.log(this.day);

            this.notes$ = this.notesService.getNoteForDay$(this.day!.id!);
            this.todolist$ = this.todosService.getTodoForDay$(this.day!.id!);
            this.timers$ = this.timersService.getTrackForDay$(this.day!.id!);

            console.log(this.notes$);
        });

        this.daysService.getDays$().subscribe(days => {
            console.log("Days: ", days);
        })
    }

    addWidget(): void {
        console.log("Add widget");
    }
}
