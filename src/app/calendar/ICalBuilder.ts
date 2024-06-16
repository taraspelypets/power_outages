import { Injectable } from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import dayjs from 'dayjs'
import { CalendarEvent } from './model/CalendarEvent';
import { EventRecurrence } from './model/EventRecurrence';

export class ICalBuilder {


    private events: string[] = [];

    public addEvent(summary: string, startTime: Date, durationMinutes: number): ICalBuilder {
        let event = `BEGIN:VEVENT
SUMMARY:${summary}
UID:${uuidv4()}
DTSTART;TZID=Europe/Kyiv:${dayjs(startTime).format("YYYYMMDDTHHmmss")}
DURATION:${this.parseDuration(durationMinutes)}
RRULE:FREQ=WEEKLY
END:VEVENT`

        this.events.push(event);
        return this;
    }

    public addEventg(event: CalendarEvent){
        `BEGIN:VEVENT
SUMMARY:${this.cleanText(event.summary)}
UID:${event.uid}
DTSTART;TZID=Europe/Kyiv:${this.formatDate(event.startDate)}
DURATION:${this.parseDuration(event.durationMinutes)}
${this.parseRecurrense(event.recurrence)}
END:VEVENT`
    }

    private parseRecurrense(recurrence?: EventRecurrence):string {
        if(!recurrence) {
            return '';
        }
        
        const count = recurrence.count ? `;COUNT=${recurrence.count}` : '';
        const interval = recurrence.interval ? `;INTERVAL=${recurrence.interval}` : '';
        const byMunthDay = recurrence.byMunthDay ? `;BYMONTHDAY=${recurrence.byMunthDay}` : '';


        return `RRULE:FREQ=${recurrence.frequency + count + interval + byMunthDay}`
    }

    private cleanText(text?: string){
        return text;
    }

    private formatDate(date: Date) {
        return dayjs(date).format("YYYYMMDDTHHmmss");
    }

    private parseDuration(durationMinutes: number): string {
        var minutes = 0;
        var hours = 0;
        var days = 0;
        if (durationMinutes >= 60) {
            hours = durationMinutes/60;
            minutes = durationMinutes%60;
        }
        if (hours >= 24) {
            days = hours/24;
            hours = hours%24;
        }
        
        return `P${ days==0 ? '' : days }T${ hours }H${ minutes }M`;
    }

    public build(): string{
        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ABC Corporation//NONSGML My Product//EN
${this.events.join('\n')}
END:VCALENDAR`;
    }

}