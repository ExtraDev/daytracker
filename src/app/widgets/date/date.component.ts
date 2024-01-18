import { Component } from '@angular/core';

@Component({
    selector: 'app-date',
    standalone: true,
    imports: [],
    templateUrl: './date.component.html',
    styleUrl: './date.component.scss'
})
export class DateComponent {
    public date: Date = new Date();
    public dayFr: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche',];
    public monFr: string[] = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Join', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];

    public getFullDate(): string {
        return `${this.dayFr[this.date.getDay() - 1]} ${this.date.getDate()}  ${this.monFr[this.date.getMonth()]} ${this.date.getFullYear()}`;
    }

    public getDate(): string {
        return ``;
    }
}
