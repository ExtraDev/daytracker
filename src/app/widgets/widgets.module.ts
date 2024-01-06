import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

/* Widget declaration */
import { TodoComponent } from './todo/todo.component';
import { NoteComponent } from './note/note.component';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  declarations: [
    TodoComponent,
    NoteComponent,
    TimerComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [
    NoteComponent,
    TodoComponent,
    TimerComponent
  ]
})
export class WidgetsModule { }
