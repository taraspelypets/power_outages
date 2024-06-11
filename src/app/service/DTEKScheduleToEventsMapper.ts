import { Event } from "../model/Event";

export class DTEKScheduleToEventsMapper {
    private events: Event[] = [];

    public flattenDTEKSchedule(scheduleData: any, startDate: Date): Event[] {
        this.traverseDays(scheduleData, startDate.getDay());
        this.mergeSimiarEvents();
        this.connectFirstAndLastEvent();
        this.attachDateToEvents(startDate);

        return this.events;
    }

    private mergeSimiarEvents() {
        let mergedEvents: Event[] = [];

        let eventMergingBase: Event;
        this.events.forEach((nextEvent) => {
            if (eventMergingBase == null || eventMergingBase.eventType != nextEvent.eventType) {
                eventMergingBase = nextEvent;
                mergedEvents.push(eventMergingBase);
            } else {
                eventMergingBase.duration = eventMergingBase.duration + nextEvent.duration;
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
        if (first != last && first.eventType == last.eventType) {
            last.duration = last.duration + first.duration;
            this.events.shift();
        }

    }

    private attachDateToEvents(startDate: Date) {
        this.events.forEach((event) => {
            let day = new Date(startDate);
            day.setUTCHours(event.startHour, 0, 0, 0);

            let daysDiff = (event.dayOfTheWeek - 1) - startDate.getDay();
            day.setDate(day.getDate() + daysDiff);

            event.start = day;
        })
    }
    private traverseDays(schedule: any, startDayOfWeek: number) {
        this.getDaysOfTheWeekStartingFrom(startDayOfWeek)
            .forEach((dayOfWeek) => {
                this.traverseHours(schedule[dayOfWeek], dayOfWeek);
            })

    }

    private traverseHours(daySchedule: any, dayOfWeek: number) {
        Object.keys(daySchedule).forEach((hour) => {
            let newEvent: Event = {
                eventType: daySchedule[hour],
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