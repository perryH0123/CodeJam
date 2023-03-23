import React, {useState, useEffect } from 'react';
import ScheduleEvent from '../Models/ScheduleEvent';

const CountdownTimer = (props: {countTo?: ScheduleEvent | null, tick: number}) => {
    const [countdownTime, setCountdownTime] = useState<string>("00:00");
    const {countTo} = props
    useEffect(() =>{ 
     if(!countTo) setCountdownTime("00:00");
    else {
        if(!countTo.countdownToNext) setCountdownTime("00:00");
        else {
            const now = new Date();
            const timeDiff = new Date(countTo.time).getTime() - now.getTime();
            if(timeDiff < 0) setCountdownTime("00:00");
            else {
                const seconds = Math.floor(timeDiff / 1000);
                const minutes = Math.floor(seconds / 60);
                setCountdownTime(`${minutes.toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`)
            }
        }
    }
    },[countTo, props.tick])

    return <h2>{countdownTime}</h2>
}

export default CountdownTimer;