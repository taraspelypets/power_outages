export enum EventFrequency {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY'
}
 
export class EventRecurrence {
    frequency: EventFrequency;
    count?: number;
    interval?: number;
    byMunthDay?: number;
    excludeDates?: Date[];

    constructor(frequency: EventFrequency) {
        this.frequency = frequency;
    }

}