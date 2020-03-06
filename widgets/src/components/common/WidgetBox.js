import React, { useState } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import { Paper, Box, Typography, IconButton, Divider } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@material-ui/icons';

const styles = {
  widgetBox: {
    background: '#FEFEFE',
  },
};

const WidgetBox = ({
  title,
  topRightComp,
  collapsible,
  hasDivider,
  classes,
  className,
  children,
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  let renderedTitle = title;
  if (typeof title === 'string') {
    renderedTitle = <Typography variant="h5">{title}</Typography>;
  }

  return (
    <Paper variant="outlined" square className={classNames(classes.widgetBox, className)}>
      {title && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={`${collapsible ? 8 : 20}px 25px`}
        >
          {renderedTitle}
          <div>
            {topRightComp}
            {collapsible && (
              <IconButton onClick={handleExpandClick}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </div>
        </Box>
      )}
      {hasDivider && <Divider />}
      {expanded && <Box p="20px 25px">{children}</Box>}
    </Paper>
  );
};

WidgetBox.propTypes = {
  title: PropTypes.node,
  topRightComp: PropTypes.node,
  collapsible: PropTypes.bool,
  hasDivider: PropTypes.bool,

  /** additional styling from parent component on root element */
  className: PropTypes.string,
  /** any node to render inside component */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,

  classes: PropTypes.shape({
    widgetBox: PropTypes.string,
  }).isRequired,
};

WidgetBox.defaultProps = {
  title: null,
  topRightComp: null,
  collapsible: false,
  hasDivider: false,
  className: '',
};

export default withStyles(styles)(WidgetBox);
