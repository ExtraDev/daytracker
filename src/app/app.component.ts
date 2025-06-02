import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialog,
    MatDialogModule,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter, of, switchMap, tap } from 'rxjs';
import { NewdayDialogComponent } from './common/dialog/newday-dialog/newday-dialog.component';
import { ValidationDialogComponent } from './common/dialog/validation-dialog/validation-dialog.component';
import { Day } from './common/models/day.model';
import { DaysService } from './common/services/day.service';
import { TimerService } from './common/services/timer.service';
import { NoteComponent } from './widgets/note/note.component';
import { TimerComponent } from './widgets/timer/timer.component';
import { TodoComponent } from './widgets/todo/todo.component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [MatButtonModule, MatIconModule, TodoComponent, TimerComponent, NoteComponent, MatSidenavModule, MatToolbarModule, MatListModule, MatDividerModule, MatDialogModule, MatTabsModule, DatePipe]
})
export class AppComponent {
    public title = 'DayAgent';
    public date = new Date();

    public daySelected = signal<Day | null>(null);
    public days = signal<ReadonlyArray<Day>>(new Array<Day>());

    private dialog = inject(MatDialog);
    private daysService = inject(DaysService);
    private timerService = inject(TimerService);
    private destroyRef = inject(DestroyRef);

    constructor() {
        effect(() => {
            const daysFromResource = this.daysResource.value();
            if (daysFromResource) {
                this.days.set(daysFromResource);
            }
        });
    }

    public daysResource = rxResource({
        loader: () => this.daysService.getDays$()
    });

    public daysSorted = computed(() => {
        const days = [...this.days()];
        return days.sort((a, b) => {
            return new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
        });
    })

    public selectDay(day: Day) {
        if (this.timerService.isStated()) {
            this.dialog.open(ValidationDialogComponent, {
                data: 'Attention, vous n\'avez  pas sauvegardé votre timer. Voulez-vous vraiment quitter et perdre votre progression?',
            }).afterClosed().pipe(
                tap(result => {
                    if (result) {
                        this.timerService.reset();
                        this.daySelected.set(day);
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            ).subscribe();
        } else {
            this.timerService.reset();
            this.daySelected.set(day);
        }
    }

    public createDay(): void {
        this.dialog.open(NewdayDialogComponent).afterClosed().pipe(
            filter(Boolean),
            switchMap(newDayResult => {
                const newDay: Day = {
                    name: newDayResult.value,
                    date: new Date().toISOString()
                };
                return this.daysService.postDay$(newDay);
            }),
            tap(newDay => {
                if (newDay) {
                    this.days.update(days => [...days, newDay]);
                }
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe()
    }

    public deleteProject(): void {
        this.dialog.open(ValidationDialogComponent, {
            data: 'Voulez-vous vraiment supprimer cette page?'
        }).afterClosed().pipe(
            filter(Boolean),
            switchMap(() => {
                const daySelected = this.daySelected();
                if (daySelected) {
                    return this.daysService.deleteDay$(daySelected);
                }

                return of(undefined);
            }),
            filter(Boolean),
            tap(success => {
                const daySelected = this.daySelected();
                if (success && daySelected) {
                    const dayId = daySelected.id;
                    if (dayId) {
                        this.days.update(projects => projects.filter(p => p.id !== dayId));
                    }
                }
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }
}
