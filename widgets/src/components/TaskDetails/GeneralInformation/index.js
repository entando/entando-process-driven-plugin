import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import GeneralInformationSkeleton from 'components/TaskDetails/GeneralInformation/GeneralInformationSkeleton';

const styles = {
  divider: {
    marginTop: '20px',
    marginBottom: '10px',
  },
  taskDatum: {
    padding: '5px 0px',
  },
  label: {
    color: '#676A6C',
    fontSize: '13px',
    lineHeight: '15px',
    fontWeight: 700,
    marginRight: '10px',
  },
};

const GeneralInformation = ({ classes, taskInputData, loadingTask }) => {
  const inputDataNotAvailable = !taskInputData || Object.keys(taskInputData).length === 0;

  if (loadingTask) {
    return <GeneralInformationSkeleton />;
  }
  return (
    <div>
      <Typography variant="h3">{i18next.t('taskDetails.generalInformation.title')}</Typography>
      <Divider className={classes.divider} />
      {inputDataNotAvailable && i18next.t('taskDetails.generalInformation.noInformation')}
      {!inputDataNotAvailable &&
        Object.keys(taskInputData).map(key => {
          return (
            <div key={key} className={classes.taskDatum}>
              <Typography variant="body1">
                <span className={classes.label}>{i18next.t(`task.inputData.${key}`)}:</span>
                {taskInputData[key]}
              </Typography>
            </div>
          );
        })}
    </div>
  );
};

GeneralInformation.propTypes = {
  classes: PropTypes.shape({
    divider: PropTypes.string,
    taskDatum: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
  taskInputData: PropTypes.shape(),
  loadingTask: PropTypes.bool,
};

GeneralInformation.defaultProps = {
  taskInputData: null,
  loadingTask: false,
};

export default withStyles(styles)(GeneralInformation);
