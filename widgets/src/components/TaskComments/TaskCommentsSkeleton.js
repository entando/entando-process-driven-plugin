import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Skeleton from '@material-ui/lab/Skeleton';
import Divider from '@material-ui/core/Divider';

const styles = {
  divider: {
    marginTop: '15px',
    marginBottom: '20px',
  },
  comment: {
    display: 'flex',
    marginTop: '10px',
    marginBottom: '5px',
    paddingLeft: '10px',
  },
  avatar: {
    margin: '5px 25px 5px 30px',
  },
  commentText: {
    marginTop: '5px',
  },
  commentInfo: {
    marginLeft: '15px',
    marginTop: '10px',
  },
  addComment: {
    marginTop: '30px',
  },
  textField: {
    marginTop: '40px',
  },
  controls: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
};

const GeneralInformationSkeleton = ({ classes }) => (
  <>
    <div>
      <Skeleton width="190px" height={20} variant="rect" />
      <Divider className={classes.divider} />
    </div>
    <div>
      <div className={classes.comment}>
        <Skeleton className={classes.avatar} width="40px" height="40px" variant="circle" />
        <div>
          <Skeleton className={classes.commentText} width="90px" height={15} variant="rect" />
          <Skeleton className={classes.commentInfo} width="190px" height={12} variant="rect" />
        </div>
      </div>
      <div className={classes.comment}>
        <Skeleton className={classes.avatar} width="40px" height="40px" variant="circle" />
        <div>
          <Skeleton className={classes.commentText} width="220px" height={15} variant="rect" />
          <Skeleton className={classes.commentInfo} width="190px" height={12} variant="rect" />
        </div>
      </div>
      <div className={classes.comment}>
        <Skeleton className={classes.avatar} width="40px" height="40px" variant="circle" />
        <div>
          <Skeleton className={classes.commentText} width="320px" height={15} variant="rect" />
          <Skeleton className={classes.commentInfo} width="190px" height={12} variant="rect" />
        </div>
      </div>
      <div className={classes.addComment}>
        <Skeleton width="50px" variant="rect" />
        <Divider className={classes.textField} />
      </div>
      <div className={classes.controls}>
        <Skeleton width="70px" height={30} variant="rect" />
      </div>
    </div>
  </>
);

GeneralInformationSkeleton.propTypes = {
  classes: PropTypes.shape({
    divider: PropTypes.string,
    comment: PropTypes.string,
    avatar: PropTypes.string,
    commentText: PropTypes.string,
    commentInfo: PropTypes.string,
    addComment: PropTypes.string,
    textField: PropTypes.string,
    controls: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(GeneralInformationSkeleton);
