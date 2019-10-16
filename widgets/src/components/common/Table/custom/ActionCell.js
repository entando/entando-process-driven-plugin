import React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import AssessmentIcon from '@material-ui/icons/Assessment';

import IconMenuButton from 'components/common/IconMenuButton';

const ActionCell = () => {
  const menuItems = [
    {
      text: 'Claim',
      icon: <HowToRegIcon fontSize="small" />,
    },
    {
      text: 'Complete',
      icon: <DoneIcon fontSize="small" />,
    },
    {
      text: 'Diagram',
      icon: <AssessmentIcon fontSize="small" />,
    },
  ];

  return <IconMenuButton menuItems={menuItems} />;
};

export default ActionCell;
