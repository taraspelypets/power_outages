import { ICalBuilder } from "./ICalBuilder";
import { log } from "console";
import { DTEKScheduleToEventsMapper } from "./DTEKScheduleToEventsMapper";
import { Event } from "../model/Event";
import { TimeType } from "../model/TimeType";

export class ICalMapper {

    constructor() { }

    public fromDTEKData(schedule: any, timeType: TimeType): string {

        let events: Event[] = new DTEKScheduleToEventsMapper().flattenDTEKSchedule(schedule, new Date());
        this.applyLabels(events, timeType);

        return this.buildICal(events);
    }

    private buildICal(events: Event[]): string {
        let builder = new ICalBuilder();

        events.forEach((event) => {
            if (event.start) {
                builder.addEvent(event.eventSummary ? event.eventSummary : event.eventType, event.start, event.duration * 60);
            }
        })

        return builder.build();
    }

    private applyLabels(events: Event[], timeType: TimeType) {
        events.forEach(event => {
            if (event.eventType == 'yes') {
                event.eventSummary = timeType.yes
            } else if (event.eventType == 'no') {
                event.eventSummary = timeType.no
            } else if (event.eventType == 'maybe') {
                event.eventSummary = timeType.maybe
            }
        });

    }
}