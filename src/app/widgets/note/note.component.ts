import { Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Note } from 'src/app/common/models/note.model';
import { NotesService } from 'src/app/common/services/note.service';

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss'],
    imports: [MatCardModule, MatButtonModule, MatIconModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule]
})
export class NoteComponent {
    public noteService = inject(NotesService);

    @Input() note?: Note;

    public editMode = false;
    public noteControl = new FormControl<string>('');

    private destroyRef = inject(DestroyRef);

    public toggleEditMode(save: boolean = false): void {
        this.editMode = !this.editMode;

        if (!save) {
            this.noteControl.setValue(this.note?.note || '');
        }

        if (save && this.note) {
            this.note.note = this.noteControl.value || '';
            this.noteService.updateNote$(this.note).pipe(
                takeUntilDestroyed(this.destroyRef)
            ).subscribe();
        }
    }
}