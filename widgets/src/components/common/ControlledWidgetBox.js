import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import { Paper, Box, Typography, Divider } from '@material-ui/core';

const styles = {
  widgetBox: {
    background: '#FEFEFE',
  },
};

const ControlledWidgetBox = ({
  title,
  topRightComp,
  hasDivider,
  classes,
  className,
  children,
  expanded,
}) => {
  let renderedTitle = title;
  if (typeof title === 'string') {
    renderedTitle = <Typography variant="h2">{title}</Typography>;
  }

  return (
    <Paper variant="outlined" square className={classNames(classes.widgetBox, className)}>
      {title && (
        <Box display="flex" justifyContent="space-between" alignItems="center" p="20px 25px">
          {renderedTitle}
          <div>{topRightComp}</div>
        </Box>
      )}
      {expanded && (
        <>
          {hasDivider && <Divider />}
          {children && <Box p="20px 25px">{children}</Box>}
        </>
      )}
    </Paper>
  );
};

ControlledWidgetBox.propTypes = {
  title: PropTypes.node,
  topRightComp: PropTypes.node,
  hasDivider: PropTypes.bool,
  expanded: PropTypes.bool,

  /** additional styling from parent component on root element */
  className: PropTypes.string,
  /** any node to render inside component */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,

  classes: PropTypes.shape({
    widgetBox: PropTypes.string,
  }).isRequired,
};

ControlledWidgetBox.defaultProps = {
  title: null,
  topRightComp: null,
  hasDivider: false,
  className: '',
  expanded: false,
};

export default withStyles(styles)(ControlledWidgetBox);
