import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DayRoutingModule } from './day-routing.module';
import { DayComponent } from './day.component';
import { NoteComponent } from './note/note.component';
import { TodolistComponent } from './todolist/todolist.component';


@NgModule({
  declarations: [
    DayComponent,
    NoteComponent,
    TodolistComponent
  ],
  imports: [
    CommonModule,
    DayRoutingModule
  ]
})
export class DayModule { }
