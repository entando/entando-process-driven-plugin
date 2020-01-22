import React from 'react';
import i18next from 'i18next';
import Typography from '@material-ui/core/Typography';

const EmptyOverview = () => {
  return (
    <Typography align="center" variant="h2">
      {i18next.t('messages.warnings.noData')}
    </Typography>
  );
};

EmptyOverview.propTypes = {};

export default EmptyOverview;
