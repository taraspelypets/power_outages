import {v4 as uuidv4} from 'uuid';
import { EventRecurrence } from './EventRecurrence';

export class CalendarEvent {
    summary?: string;
    uid: string;
    timezone?: string;
    startDate: Date;
    durationMinutes: number = 60;
    endDate?: Date;
    recurrence?: EventRecurrence;

    constructor(uid: string, startDate: Date) {
        this.uid = uid;
        this.startDate = startDate;
    }

    public static new(startDate: Date): CalendarEvent {
        return new CalendarEvent(uuidv4(), startDate);
    }
}