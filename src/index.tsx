import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import MainView from './Routes/main';
import Awards from './Routes/awards';
import Schedule from './Routes/schedule';
import Teams from './Routes/teams'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="*" element={<App />}>
            <Route path="schedule" element={<Schedule />} />
            <Route path="teams" element={<Teams />} />
            <Route path="awards" element={<Awards />} />
            <Route path="" element={<MainView />} />
            <Route path="*" element={<Navigate to=""/>} />
          </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
