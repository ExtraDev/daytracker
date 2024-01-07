import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

/* Widgets declaration */
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
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NoteComponent,
    TodoComponent,
    TimerComponent
  ]
})
export class WidgetsModule { }
