import { Component, Input } from '@angular/core';
import { Status, Todo } from 'src/app/common/models/todo.model';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.scss']
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
