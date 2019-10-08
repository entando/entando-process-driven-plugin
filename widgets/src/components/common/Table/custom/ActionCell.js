import React from 'react';

import IconMenuButton from 'components/common/IconMenuButton';

const ActionCell = () => {
  const menuItems = [
    {
      text: 'Claim',
    },
    {
      text: 'Complete',
    },
    {
      text: 'Diagram',
    },
  ];

  return <IconMenuButton menuItems={menuItems} />;
};

export default ActionCell;
