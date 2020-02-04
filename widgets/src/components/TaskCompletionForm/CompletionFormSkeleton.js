import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Skeleton from '@material-ui/lab/Skeleton';
import Divider from '@material-ui/core/Divider';

const styles = {
  header: {
    marginTop: '20px',
  },
  divider: {
    marginTop: '25px',
    marginBottom: '53px',
  },
  item: {
    marginBottom: '53px',
  },
  field: {
    marginTop: '8px',
    marginBottom: '3px',
  },
  controls: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
};

const CompletionFormSkeleton = ({ classes }) => (
  <>
    <div>
      <Skeleton width="280px" height={18} variant="rect" className={classes.header} />
      <Divider className={classes.divider} />
    </div>
    <div className={classes.item}>
      <Skeleton width="80px" height={15} variant="rect" />
      <Divider className={classes.field} />
      <Skeleton width="120px" height={12} variant="rect" />
    </div>
    <div>
      <Skeleton width="80px" height={15} variant="rect" />
      <Divider className={classes.field} />
      <Skeleton width="160px" height={12} variant="rect" />
    </div>
    <div className={classes.controls}>
      <Skeleton width="80px" height={30} variant="rect" />
    </div>
  </>
);

CompletionFormSkeleton.propTypes = {
  classes: PropTypes.shape({
    header: PropTypes.string,
    divider: PropTypes.string,
    item: PropTypes.string,
    field: PropTypes.string,
    controls: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(CompletionFormSkeleton);
