import { Component } from '@angular/core';
import { Note } from './common/models/note.model';
import { Status, Todo } from './common/models/todo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'daytracker';

  note: Note = {
    note: "Bonjour je suis le contenu de la note :D"
  }

  public todolist: Todo[] = [
    {
      name: "Bonjour je suis la première todo",
      status: Status.Todo,
      timer: false,
      elapsed: 0
    }, {
      name: "Bonjour je suis la deuxième todo et je suis timé",
      status: Status.Done,
      timer: true,
      elapsed: 500
    }
  ]

  constructor() {

  }

  addWidget(): void {
    console.log("Add widget");
  }
}
