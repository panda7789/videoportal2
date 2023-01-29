import { Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import HistoryIcon from '@mui/icons-material/History';

export default function MyPortal() {
  const [value, setValue] = useState(0);

  const handleChange = (_e: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };
  const { pathname } = useLocation();

  useEffect(() => {
    switch (pathname) {
      case '/myportal/history':
        setValue(1);
        break;

      default:
        setValue(0);
        break;
    }
  }, [pathname]);

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
