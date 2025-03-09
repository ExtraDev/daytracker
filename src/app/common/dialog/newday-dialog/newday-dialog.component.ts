import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-newday-dialog',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatDialogModule
    ],
    templateUrl: './newday-dialog.component.html',
    styleUrl: './newday-dialog.component.scss'
})
export class NewdayDialogComponent {
    public dayName = new FormControl('', Validators.required);

    constructor(
        private dialogRef: MatDialogRef<NewdayDialogComponent>
    ) { }

    closeDialog(): void {
        this.dialogRef.close();
    }
}