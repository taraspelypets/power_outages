import { Component, Input } from '@angular/core';
import { City } from '../model/City';
import { TimeType } from '../model/TimeType';
import timeTypePresets from '../../assets/settings/timeTypePresets.json'
import { OutageDataSource } from '../service/OutageDataSource';
import { TempFileUploadService } from '../service/TempFileUploadService';
import { ICalMapper } from '../service/ICalMapper';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-calendar-download-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-download-component.component.html',
  styleUrl: './calendar-download-component.component.scss'
})
export class CalendarDownloadComponentComponent {
  timeTypePresets = timeTypePresets;

  @Input() city: City = { name: '', displayName: '', scheduleSource: '', officialRecource: '' };
  @Input() group: string = '';
  @Input() schedule = {};

  timeType: TimeType;
  fileLink?: string;

  constructor(private outageDaraSource: OutageDataSource, private tempFileUploadService: TempFileUploadService) {
    this.timeType = this.timeTypePresets[0].timeType;
  }

  createIcal() {
    let icalContent = new ICalMapper().fromDTEKData((<any>this.schedule).data[this.group], this.timeType)

    this.tempFileUploadService.uploadTempFile(icalContent, this.createFilename())
      .subscribe((result) => {
        console.log(result)
        if ((<any>result).status == 'success') {
          this.fileLink = (<string>(<any>result).data.url);
        }

      });
  }

  private createFilename(): string {
    return `${this.city.name}-${this.group}.ics`
  }

  selectTimeTypePreset(timeType: TimeType) {
    this.timeType = timeType
  }

}
