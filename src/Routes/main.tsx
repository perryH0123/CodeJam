import React, { useEffect, useState, useRef } from "react";
import { useModifiedPayload } from "../App";
import CountdownTimer from "../Components/CountdownTimer";
import ScheduleEvent from "../Models/ScheduleEvent";
import { Link } from "react-router-dom";
const MainView = () => {
    const {schedule, submissionsOpen} = useModifiedPayload()
    const [currentEventIndex, setCurrentEventIndex] = useState<number>(0)
    const [nextEvent, setNextEvent] = useState<ScheduleEvent | null>(null)
    const [tick, setTick] = useState(0)
    const intervalIdRef = useRef<NodeJS.Timer | null>(null);
    useEffect(() => {
      intervalIdRef.current = setInterval(() => {
        const now = new Date();
        let cei = schedule.findIndex(
          (event) => new Date(event.time).getTime() > now.getTime()
        )-1;
          if(cei === -2) cei += 1
          setNextEvent(
            cei <= -2 ? null : schedule[cei+1]
          );
          setCurrentEventIndex(cei);
        setTick(tick => tick+1)
      }, 500);
  
      return () => {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }
      };
    }, [schedule]);
    if(schedule && schedule.length && Date.now() >= schedule[schedule.length-1].time.valueOf()) return (
    <div id="countdown-content">
        <h1>Code Jam 2023 has ended!</h1>
        <h4>Thank you for coming to Code Jam 2023! We hope you enjoyed the event, and we hope to see you at Code Jam 2024!</h4>
        <h4><Link to="awards">Awards</Link></h4>
    </div>
    )
    if (currentEventIndex > -2) return (<main>
          <div id="countdown-content">
              <CountdownTimer countTo={nextEvent} tick={tick}/>
              {schedule && <div id="countdown-event">
                  <h3 id="current-label">Now happening:</h3>
                  {schedule.length>0 && typeof currentEventIndex === "number"  && schedule[currentEventIndex] && <h3 id="current-event">{currentEventIndex === schedule.length-1 || !schedule ? "Thank you for coming to Code Jam 2023!" : `${new Date(schedule[currentEventIndex].time).toLocaleTimeString().replace(/(.*)\D\d+/, '$1')} - ${schedule[currentEventIndex].name}`}</h3>}
              </div>}
              {submissionsOpen && <a id="submit" href="https://abc-code-jam-2023.devpost.com/">Submit Project</a>}
          </div>
          <div id="events">
              <div id="previous">
                  {schedule && (currentEventIndex>0) &&
                  <>
                    <h3 id="previous-label">Previous:</h3>
                    <h3 id="previous-event">{`${new Date(schedule[currentEventIndex-1].time).toLocaleTimeString().replace(/(.*)\D\d+/, '$1')} - ${schedule[currentEventIndex-1].name}`}</h3>
                  </>
                  }
              </div>
              <div className="sep"></div>
              <div id="next">
                {schedule && currentEventIndex < schedule.length-1 &&
                  <>
                    <h3 id="next-label">Coming up:</h3>
                    <h3 id="next-event">{`${new Date(schedule[currentEventIndex+1].time).toLocaleTimeString().replace(/(.*)\D\d+/, '$1')} - ${schedule[currentEventIndex+1].name}`}</h3>
                  </>
                }
              </div>
          </div>
      </main>
    );
    else return <></>
}

export default MainView;