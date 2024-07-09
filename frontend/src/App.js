import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { LocalFlorist, Forest, SettingsSuggest } from '@mui/icons-material';
import HomeView from './views/HomeView';
import InsightsView from './views/InsightsView';
import SettingsView from './views/SettingsView';
import Entry from './components/home/Entry';
import NewEntry from './styles/home/NewEntry';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get current location
  const [screen, setScreen] = useState(location.pathname); // Initialize screen state with current pathname

  const handleScreen = (newScreen) => {
    navigate(newScreen); // Navigate to the new screen path
    setScreen(newScreen); // Update screen state to reflect the new screen
  };

  return (
    <BottomNavigation 
      showLabels 
      className='bottomNav' 
      value={screen} 
      onChange={(event, newScreen) => handleScreen(newScreen)}>
      <BottomNavigationAction value="/insights" label="Insights" icon={<LocalFlorist />} />
      <BottomNavigationAction value="/" label="Home" icon={<Forest />} />
      <BottomNavigationAction value="/settings" label="Settings" icon={<SettingsSuggest />} />
    </BottomNavigation>
  );
}

function App() {
  return (
    <div className="App">
      <div className="dimensionsWarning">
        <h1>Please view the application in mobile mode</h1>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/insights" element={<InsightsView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/entry" element={<Entry />} />
          <Route path="/newentry" element={<NewEntry />} />
        </Routes>
        <Navigation />
      </BrowserRouter>
    </div>
  );
}

export default App;
