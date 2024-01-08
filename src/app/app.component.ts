import { Component } from '@angular/core';
import { NotesService } from './common/services/note.service';
import { TodosService } from './common/services/todo.service';
import { TimersService } from './common/services/timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'daytracker';

  public dayId = 1;

  public notes$ = this.notesService.getNotes$();
  public todolist$ = this.todosService.getTodos$();
  public timers$ = this.timerService.getTracks$();

  constructor(
    private notesService: NotesService,
    private todosService: TodosService,
    private timerService: TimersService
  ) { }

  addWidget(): void {
    console.log("Add widget");
  }
}
