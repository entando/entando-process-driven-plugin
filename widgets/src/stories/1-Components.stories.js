import React from 'react';

import WidgetBox from 'components/common/WidgetBox';
import BadgeChip from 'components/common/BadgeChip';

export default {
  title: 'Components',
};

export const widgetBox = () => <WidgetBox>WIDGET BOX</WidgetBox>;

export const badgeChip = () => <BadgeChip label="Approved" />;
