import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import OverviewNavigation from 'components/TaskDetails/Overview/OverviewNavigation';

const OverviewHeader = ({ title }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h2">{title}</Typography>
      <OverviewNavigation />
    </Box>
  );
};

OverviewHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default OverviewHeader;
