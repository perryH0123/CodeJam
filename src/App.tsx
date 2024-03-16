import React, { useEffect } from 'react';
//import logo from './logo.svg';
import {BsFillGearFill} from 'react-icons/bs'
import {Outlet, NavLink, useOutletContext} from 'react-router-dom';
import './App.css';
import ScheduleEvent from './Models/ScheduleEvent';
import Award from './Models/Award';
import { Link } from 'react-router-dom';

interface DataPayload {
  submissionsOpen: boolean;
  schedule: ScheduleEvent[];
  awards: Award[];
}

export const CurrentEventIndexContext = React.createContext(0)
export const UpdateTimeContext = React.createContext(() => {})

function App() {
  const [payload, setPayload] = React.useState<DataPayload>({schedule: [],submissionsOpen: false, awards: []} as DataPayload);

  
  const fetchData = async () => {
    try {
      const rawPayload = await fetch("https://script.google.com/macros/s/AKfycbyAKLDv0lNMn1-WYaV7us4CHrkc4ymKzBP7L2OqfUx2VcfnfXo-bdArfr2p7WtuxTgd/exec", {
        method: "GET",
      });
      const pl = await rawPayload.json()
      setPayload(pl as DataPayload)
    } catch (e) {
        console.log("Error fetching data",e)
    } finally{
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 120000);
    return () => clearInterval(interval);
  }, [])

  return (
    <div className="App">
      <div id="banner">
        <h1>Code Jam 2024</h1>
        <h2>Dashboard</h2>
        <h3><Link to="https://drive.google.com/drive/folders/1fTmOw8xfpFoMGZIaql2peYB0Iq0zzzs7?usp=sharing" target="_blank">Submission Tutorial Videos</Link></h3>
        <h3>Submissions will open at 5:15 PT</h3></div>
      <a href="https://docs.google.com/spreadsheets/d/1zYlF5b4yPZolKSg63H--swc-sVNpfCL7hwm-wdYj6V8/edit?usp=sharing" id="edit">
          <BsFillGearFill className="bi bi-gear"/>
      </a>
      <ul id="screenSelect">
          <li><NavLink to="">Main Display</NavLink></li>
          <li><NavLink to="schedule">Schedule</NavLink></li>
          <li><NavLink to="teams">Teams</NavLink></li>
          <li><NavLink to="awards">Awards</NavLink></li>
      </ul>
        <Outlet context={payload}/>
    </div>
  );
}

export function useModifiedPayload(){
  return useOutletContext<DataPayload>();
}
export default App;
