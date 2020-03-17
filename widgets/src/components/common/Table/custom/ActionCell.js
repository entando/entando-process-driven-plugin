import React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import AssessmentIcon from '@material-ui/icons/Assessment';
import i18next from 'i18next';

import IconMenuButton from 'components/common/IconMenuButton';

const ActionCell = (options, { openDiagram }) => data => {
  const menuItems = [];

  if (options.showComplete) {
    menuItems.push({
      text: i18next.t('taskList.actionButtons.complete'),
      icon: <DoneIcon fontSize="small" />,
    });
  }

  if (options.showClaim) {
    menuItems.push({
      text: i18next.t('taskList.actionButtons.claim'),
      icon: <HowToRegIcon fontSize="small" />,
    });
  }

  menuItems.push({
    text: i18next.t('taskList.actionButtons.diagram'),
    icon: <AssessmentIcon fontSize="small" />,
    onClick: openDiagram(data.row),
  });

  return <IconMenuButton menuItems={menuItems} />;
};

export default ActionCell;
