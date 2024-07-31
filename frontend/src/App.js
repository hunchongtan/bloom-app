import { useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { LocalFlorist, Forest, SettingsSuggest } from '@mui/icons-material';
import HomeView from './views/HomeView';
import SettingsView from './views/SettingsView';
import LoginView from './views/LoginView';
import NewEntry from './components/home/newentry/NewEntry';
import HomeAltView from './views/HomeAltView';
import NewEntryAlt from './components/home/newentry/NewEntryAlt';
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
        navigate("/home");
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
  const location = useLocation();

  return (
    <div className="App">
      <div className="dimensionsWarning">
        <h1>Please view the application in mobile mode</h1>
      </div>
      <Routes>
        <Route path='/' element={<LoginView />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/homeAlt" element={<HomeAltView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/entry/new" element={<NewEntry />} />
        <Route path="/entryAlt/new" element={<NewEntryAlt />} />
      </Routes>
      {location.pathname !== '/' && location.pathname !== '/entry/new' && location.pathname !== '/entryAlt/new' && <Navigation />}
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
