import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
    selector: 'app-date',
    imports: [DatePipe],
    templateUrl: './date.component.html',
    styleUrl: './date.component.scss'
})
export class DateComponent {
    public date: Date = new Date();
}
