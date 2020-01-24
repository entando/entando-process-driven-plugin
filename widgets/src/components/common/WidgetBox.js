import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';

const styles = {
  widgetBox: {
    background: '#FEFEFE',
    padding: '20px 25px',
  },
};

const WidgetBox = ({ classes, passedClassName, children }) => (
  <Paper variant="outlined" square className={classNames(classes.widgetBox, passedClassName)}>
    {children}
  </Paper>
);

WidgetBox.propTypes = {
  /** additional styling from parent component on root element */
  passedClassName: PropTypes.string,
  /** any node to render inside component */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,

  classes: PropTypes.shape({
    widgetBox: PropTypes.string,
  }).isRequired,
};

WidgetBox.defaultProps = {
  passedClassName: '',
};

export default withStyles(styles)(WidgetBox);
