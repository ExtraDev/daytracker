import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Status, Todo } from 'src/app/common/models/todo.model';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.scss'],
    imports: [MatCardModule, MatButtonModule]
})
export class TodoComponent {
    @Input() todo?: Todo

    changeStatus(): void {
        if (this.todo) {
            if (this.todo.status === Status.Todo) {
                this.todo.status = Status.InProgress
            } else if (this.todo.status === Status.InProgress) {
                this.todo.status = Status.Done
            } else {
                this.todo.status = Status.Todo
            }
        }
    }
}
