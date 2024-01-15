import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Note } from 'src/app/common/models/note.model';

@Component({
  selector: 'app-note',
  standalone: true,
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  imports: [MatCardModule],
})
export class NoteComponent {
  @Input() note?: Note;

  constructor() { }
}