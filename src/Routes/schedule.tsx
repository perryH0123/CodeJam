import React, { useEffect, useRef, useState } from "react";
import { useModifiedPayload } from "../App";
const Schedule = () => {
    const {schedule} = useModifiedPayload()
    const [currentEventIndex, setCurrentEventIndex] = useState<number>(-1)
    const intervalIdRef = useRef<NodeJS.Timer | null>(null);
    useEffect(() => {
        const calcNow = () => {
            const now = new Date();
            const cei = schedule.findIndex(
              (event) => new Date(event.time).getTime() > now.getTime()
            )-1;
            if (currentEventIndex !== cei) {
              setCurrentEventIndex(cei);
            }
        }
      intervalIdRef.current = setInterval(() => {
        calcNow();
      }, 10000);
      calcNow();
      return () => {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }
      };
    }, [schedule]);

    return (
    <section id="schedule">
    <h2>Schedule</h2>
    <div className="scrollableTable">
        <table id="timetable">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Event</th>
                </tr>
            </thead>
            <tbody>
                {schedule.map((event, index) => {
                    return (
                        <tr key={index} className={index === currentEventIndex ? "highlighted" : ""}>
                            <td>{new Date(event.time).toLocaleTimeString("en-US",{
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true
                            })}</td>
                            <td>{event.name}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
    </section>
    )
}
export default Schedule;