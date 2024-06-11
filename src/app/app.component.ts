import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import cities from '../assets/cities.json'
import { City } from './model/City';
import { OutageDataSource } from './service/OutageDataSource';
import { HttpClientModule } from '@angular/common/http';
import { ICalMapper } from './service/ICalMapper';
import { TempFileUploadService } from './service/TempFileUploadService';
import { TimeType } from './model/TimeType';
import timeTypePresets from '../assets/settings/timeTypePresets.json'
import { CalendarDownloadComponentComponent } from './calendar-download-component/calendar-download-component.component';
import { CalendarComponentComponent } from './calendar-component/calendar-component.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, CalendarDownloadComponentComponent, CalendarComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  cities = cities;
  selectedCity: City = { name: '', displayName: '', scheduleSource: '' };

  groups = {};
  selectedGroup: string = '';

  schedule:any = {};

  timeTypePresets = timeTypePresets;

  timeType: TimeType;

  fileLink?: string;

  constructor(private outageDaraSource: OutageDataSource, private tempFileUploadService: TempFileUploadService) {
    this.timeType = this.timeTypePresets[0].timeType;
  }
  selectCity(city: City) {
    this.selectedCity = city;
    this.selectedGroup = '';
    this.loadSchedule();
  }

  selectTimeTypePreset(timeType: TimeType) {
    this.timeType = timeType
  }

  selectGroup(group: string) {
    this.selectedGroup = group;

  }
  createIcal() {
    let icalContent = new ICalMapper().fromDTEKData((<any>this.schedule).data[this.selectedGroup], this.timeType)
    this.fileLink = "/link.ics"
    // console.log(icalContent);
    // this.tempFileUploadService.uploadTempFile(icalContent, this.createFilename())
    //   .subscribe((result) => {
    //     console.log(result)
    //     if ((<any>result).status == 'success') {
    //       this.fileLink = (<string>(<any>result).data.url);
    //     }

    //   });
  }

  private createFilename(): string {
    return `${this.selectedCity.name}-${this.selectedGroup}.ics`
  }

  loadSchedule() {
    this.outageDaraSource.getOutageDataForCity(this.selectedCity.name)
      .subscribe((result) => this.setSchedule(result))
  }

  private setSchedule(schedule: any) {
    this.schedule = schedule;
    this.groups = schedule.sch_names;
    console.log(schedule);
  }

}
