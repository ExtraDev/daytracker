import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-validation-dialog',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatDialogModule
    ],
    templateUrl: './validation-dialog.component.html',
    styleUrl: './validation-dialog.component.scss'
})
export class ValidationDialogComponent {
    public validationBox = new FormControl<boolean>(false, Validators.required);

    constructor(
        private dialogRef: MatDialogRef<ValidationDialogComponent>
    ) { }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
