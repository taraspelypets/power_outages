import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import emptySchedule from '../../assets/settings/emptySchedule.json'
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-calendar-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-component.component.html',
  styleUrl: './calendar-component.component.scss'
})
export class CalendarComponentComponent {
  environment = environment;
  @Input() schedule?: any = emptySchedule;

  today: Date = new Date();

  editable: boolean = false;

  days = [1, 2, 3, 4, 5, 6, 7];
  hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

  typeImage: any = {
    yes: `${environment.baseUrl}assets/yes-electricity.png`,
    no: `${environment.baseUrl}assets/no-electricity.png`,
    maybe: `${environment.baseUrl}assets/maybe-electricity.png`
  }


  toHourLabel(hour: number) {
    return `${hour.toString().padStart(2, '0')}:00`
  }

  isToday(dayOfWeek: number): boolean {
    return this.today.getDay() == dayOfWeek;
  }

  cycleType(day: number, hour: number) {
    if(!this.editable) {
      return
    }

    let type = this.schedule[day][hour];
    if (type == 'yes') {
      this.schedule[day][hour] = 'maybe';
    } else if (type == 'maybe') {
      this.schedule[day][hour] = 'no';
    } else if (type == 'no') {
      this.schedule[day][hour] = 'yes';
    } else {
      this.schedule[day][hour] = 'yes';
    }
  }

  logSchedule() {
    console.log(this.schedule);
  }


}
