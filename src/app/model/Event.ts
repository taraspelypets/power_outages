export interface Event {
    eventType: string;
    eventSummary?:string;
    dayOfTheWeek: number;
    startHour: number;
    start?: Date;
    duration: number;
    reccurent?: boolean;
}