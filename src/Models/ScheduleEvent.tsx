export default interface ScheduleEvent {
    time: Date;
    name: string;
    countdownToNext: boolean;
}