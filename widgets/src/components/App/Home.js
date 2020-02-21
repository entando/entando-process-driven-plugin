import React from 'react';
import Typography from '@material-ui/core/Typography';

import { createWidgetEvent, PDA_CONFIG_ON_UPDATE } from 'custom-elements/customEventsUtils';

setTimeout(() => {
  localStorage.setItem(
    'badgeStyles',
    JSON.stringify({
      success: {
        bgColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      },
      fail: {
        bgColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      },
      pending: {
        bgColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      },
    })
  );
  createWidgetEvent(PDA_CONFIG_ON_UPDATE)();
}, 5000);

const Home = () => (
  <div className="app-home">
    <Typography variant="h4">Entando Process Automation Manager</Typography>
    <Typography variant="body1">
      This is a demo page of all available Entando PAM widgets
    </Typography>
  </div>
);

export default Home;
