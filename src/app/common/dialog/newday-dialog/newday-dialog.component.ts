import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    public dayName = new FormControl(this.getActualDate(), Validators.required);

    private dialogRef = inject(MatDialogRef<NewdayDialogComponent>)

    public closeDialog(): void {
        this.dialogRef.close();
    }

    public getActualDate(): string {
        return new Date().toLocaleString().split(' ')[0];
    }
}