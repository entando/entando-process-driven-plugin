import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    background: 'transparent !important',
    '& td': {
      textAlign: 'center',
      padding: 0,
    },
  },
  text: {
    color: '#ccc',
  },
};

const EmptyRow = ({ classes, colspan, text, height }) => (
  <tbody>
    <tr className={classes.root}>
      <td colSpan={colspan} style={{ height }}>
        <Typography variant="body1" className={classes.text}>
          {text}
        </Typography>
      </td>
    </tr>
  </tbody>
);

EmptyRow.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    text: PropTypes.string,
  }),
  colspan: PropTypes.number,
  text: PropTypes.string,
  height: PropTypes.number,
};

EmptyRow.defaultProps = {
  classes: {},
  colspan: 1,
  text: 'No data to display',
  height: 250,
};

export default withStyles(styles)(EmptyRow);
