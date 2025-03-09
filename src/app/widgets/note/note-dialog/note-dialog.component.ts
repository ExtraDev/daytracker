import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-note-dialog',
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
    templateUrl: './note-dialog.component.html',
    styleUrl: './note-dialog.component.scss'
})
export class NoteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NoteDialogComponent>
  ) { }

}
