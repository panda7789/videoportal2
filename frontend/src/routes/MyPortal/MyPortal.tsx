import { Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import HistoryIcon from '@mui/icons-material/History';

export default function MyPortal() {
  const [value, setValue] = useState(0);

  const handleChange = (_e: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange} aria-label="nav tabs example" centered>
        <Tab
          icon={<VideoSettingsIcon />}
          iconPosition="start"
          component={Link}
          to="./"
          label="Moje videa"
        />
        <Tab
          icon={<HistoryIcon />}
          iconPosition="start"
          component={Link}
          to="./history"
          label="Historie"
        />
      </Tabs>
      <Outlet />
    </>
  );
}
