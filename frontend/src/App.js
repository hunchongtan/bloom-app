import { useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { LocalFlorist, Forest, SettingsSuggest } from '@mui/icons-material';
import HomeView from './views/HomeView';
import InsightsView from './views/InsightsView';
import SettingsView from './views/SettingsView';
import LoginView from './views/LoginView';
import Entry from './components/home/Entry';
import NewEntry from './components/home/newentry/NewEntry';
import './App.css';

function Navigation() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("home");

  const handleScreen = (screen) => {
    switch (screen) {
      case "home":
        navigate("/home");
        break;
      case "insights":
        navigate("/insights");
        break;
      case "settings":
        navigate("/settings");
        break;
      default:
        navigate("/home");
        break;
    }
    setScreen(screen);
  };

  return (
    <BottomNavigation
      showLabels
      className='bottomNav'
      value={screen}
      onChange={(event, newScreen) => handleScreen(newScreen)}
    >
      <BottomNavigationAction value="insights" label="Insights" icon={<LocalFlorist />} />
      <BottomNavigationAction value="home" label="Home" icon={<Forest />} />
      <BottomNavigationAction value="settings" label="Settings" icon={<SettingsSuggest />} />
    </BottomNavigation>
  );
}

function App() {
  const [weeklyMoodCounts, setWeeklyMoodCounts] = useState([]);
  const location = useLocation();

  return (
    <div className="App">
      <div className="dimensionsWarning">
        <h1>Please view the application in mobile mode</h1>
      </div>
      <Routes>
        <Route path='/' element={<LoginView />} />
        <Route path="/home" element={<HomeView setWeeklyMoodCounts={setWeeklyMoodCounts} />} />
        <Route path="/insights" element={<InsightsView weeklyMoodCounts={weeklyMoodCounts} />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/entry/new" element={<NewEntry />} />
      </Routes>
      {location.pathname !== '/' && location.pathname !== '/entry/new' && <Navigation />}
    </div>
  );
}

function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default Root;

