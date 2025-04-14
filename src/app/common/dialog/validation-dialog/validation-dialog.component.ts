import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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

    readonly dialogRef = inject(MatDialogRef<ValidationDialogComponent>);
    readonly message = inject<string>(MAT_DIALOG_DATA);

    public closeDialog(): void {
        this.dialogRef.close();
    }
}
