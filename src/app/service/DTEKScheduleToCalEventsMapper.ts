import { log } from "node:console";
import { Event } from "../model/Event";
import { CalendarEvent } from "../calendar/model/CalendarEvent";

export class DTEKScheduleToCalEventsMapper {
    private events: CalendarEvent[] = [];

    public flattenDTEKSchedule(scheduleData: any, startDate: Date): CalendarEvent[] {
        this.traverseDays(scheduleData, startDate.getDay());
        this.mergeSimiarEvents();
        this.connectFirstAndLastEvent();
        this.attachDateToEvents(startDate);

        return this.events;
    }

    private mergeSimiarEvents() {
        let mergedEvents: CalendarEvent[] = [];

        let eventMergingBase: CalendarEvent;
        this.events.forEach((nextEvent) => {
            if (eventMergingBase == null || eventMergingBase.summary != nextEvent.summary) {
                eventMergingBase = nextEvent;
                mergedEvents.push(eventMergingBase);
            } else {
                eventMergingBase.durationMinutes = eventMergingBase.durationMinutes + nextEvent.durationMinutes;
            }
        })

        this.events = mergedEvents;
    }

    private connectFirstAndLastEvent() {
        if (this.events.length == 0) {
            return
        }

        let first = this.events[0];
        let last = this.events[this.events.length - 1];
        if (first != last && first.summary == last.summary) {
            last.durationMinutes = last.durationMinutes + first.durationMinutes;
            this.events.shift();
        }

    }

    private attachDateToEvents(startDate: Date) {

        this.events.forEach((event) => {
            let day = new Date(startDate);
            day.setHours(event.startHour - 1, 0, 0, 0);

            let daysDiff = this.toSundayBasedWeekDayIndex(event.dayOfTheWeek) - startDate.getDay();

            day.setDate(day.getDate() + daysDiff);

            event.startDate = day;
        })
    }

    private toSundayBasedWeekDayIndex(mondayBased: number){
        if(mondayBased == 7) {
            return 0;
        }

        return mondayBased;
    }
    private traverseDays(schedule: any, startDayOfWeek: number) {
        this.getDaysOfTheWeekStartingFrom(startDayOfWeek)
            .forEach((dayOfWeek) => {
                this.traverseHours(schedule[dayOfWeek], dayOfWeek);
            })

    }

    private traverseHours(daySchedule: any, dayOfWeek: number) {
        Object.keys(daySchedule).forEach((hour) => {
            let newEvent: CalendarEvent = {
                summary: daySchedule[hour],
                dayOfTheWeek: dayOfWeek,
                startHour: parseInt(hour),
                duration: 1
            }

            this.events.push(newEvent);
        });
    }


    private getDaysOfTheWeekStartingFrom(dayOfTheWeek: number): number[] {
        let days: number[] = [];
        for (let count = 0; count <= 6; count++) {
            if (dayOfTheWeek > 7 || dayOfTheWeek < 1) {
                dayOfTheWeek = 1;
            }
            days.push(dayOfTheWeek);

            dayOfTheWeek++;
        }       

        return days;
    }

}