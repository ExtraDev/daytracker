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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, MatIconModule, TodoComponent, TimerComponent, NoteComponent]
})
export class AppComponent {
  title = 'daytracker';

  private notesService = inject(NotesService);
  private todosService = inject(TodosService);
  private timersService = inject(TimersService);

  public dayId = 1;

  public notes$ = this.notesService.getNotes$();
  public todolist$ = this.todosService.getTodos$();
  public timers$ = this.timersService.getTracks$();

  constructor() { }

  addWidget(): void {
    console.log("Add widget");
  }
}
