import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Skeleton from '@material-ui/lab/Skeleton';
import Divider from '@material-ui/core/Divider';

const styles = {
  divider: {
    marginTop: '20px',
    marginBottom: '15px',
  },
  dataRow: {
    display: 'flex',
    marginTop: '10px',
    marginBottom: '5px',
  },
  value: {
    marginLeft: '10px',
  },
};

const DATA_ROW_HEIGHT = 15;

const GeneralInformationSkeleton = ({ classes }) => (
  <>
    <div>
      <Skeleton width="190px" height={25} variant="rect" />
      <Divider className={classes.divider} />
    </div>
    <div>
      <div className={classes.dataRow}>
        <Skeleton width="100px" height={DATA_ROW_HEIGHT} variant="rect" />
        <Skeleton className={classes.value} width="100px" height={DATA_ROW_HEIGHT} variant="rect" />
      </div>
      <div className={classes.dataRow}>
        <Skeleton width="150px" height={DATA_ROW_HEIGHT} variant="rect" />
        <Skeleton className={classes.value} width="190px" height={DATA_ROW_HEIGHT} variant="rect" />
      </div>
      <div className={classes.dataRow}>
        <Skeleton width="80px" height={DATA_ROW_HEIGHT} variant="rect" />
        <Skeleton className={classes.value} width="190px" height={DATA_ROW_HEIGHT} variant="rect" />
      </div>
      <div className={classes.dataRow}>
        <Skeleton width="100px" height={DATA_ROW_HEIGHT} variant="rect" />
        <Skeleton className={classes.value} width="100px" height={DATA_ROW_HEIGHT} variant="rect" />
      </div>
      <div className={classes.dataRow}>
        <Skeleton width="150px" height={DATA_ROW_HEIGHT} variant="rect" />
        <Skeleton className={classes.value} width="190px" height={DATA_ROW_HEIGHT} variant="rect" />
      </div>
      <div className={classes.dataRow}>
        <Skeleton width="80px" height={DATA_ROW_HEIGHT} variant="rect" />
        <Skeleton className={classes.value} width="190px" height={DATA_ROW_HEIGHT} variant="rect" />
      </div>
      <div className={classes.dataRow}>
        <Skeleton width="100px" height={DATA_ROW_HEIGHT} variant="rect" />
        <Skeleton className={classes.value} width="100px" height={DATA_ROW_HEIGHT} variant="rect" />
      </div>
      <div className={classes.dataRow}>
        <Skeleton width="150px" height={DATA_ROW_HEIGHT} variant="rect" />
        <Skeleton className={classes.value} width="190px" height={DATA_ROW_HEIGHT} variant="rect" />
      </div>
      <div className={classes.dataRow}>
        <Skeleton width="80px" height={DATA_ROW_HEIGHT} variant="rect" />
        <Skeleton className={classes.value} width="190px" height={DATA_ROW_HEIGHT} variant="rect" />
      </div>
    </div>
  </>
);

GeneralInformationSkeleton.propTypes = {
  classes: PropTypes.shape({
    divider: PropTypes.string,
    dataRow: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(GeneralInformationSkeleton);
