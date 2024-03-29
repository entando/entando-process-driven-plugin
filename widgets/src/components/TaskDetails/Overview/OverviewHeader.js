import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import OverviewNavigation from './OverviewNavigation';

const OverviewHeader = ({ title, taskLink }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      {title.toLowerCase().includes('overview') ? (
        <Link href={taskLink} variant="h2">
          {title}
        </Link>
      ) : (
        <Typography variant="h2">{title}</Typography>
      )}

      <OverviewNavigation />
    </Box>
  );
};

OverviewHeader.propTypes = {
  title: PropTypes.string.isRequired,
  taskLink: PropTypes.string,
};

OverviewHeader.defaultProps = {
  taskLink: null,
};

export default OverviewHeader;
