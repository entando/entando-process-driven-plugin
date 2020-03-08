import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { Typography, Grid } from '@material-ui/core';

import GeneralInformationSkeleton from 'components/TaskDetails/GeneralInformation/GeneralInformationSkeleton';
import WidgetBox from 'components/common/WidgetBox';

const styles = {
  label: {
    color: '#676A6C',
    fontSize: '13px',
    lineHeight: '15px',
    fontWeight: 700,
    marginRight: '10px',
  },
};

const GeneralInformation = ({ classes, taskInputData, loadingTask, noHeadline }) => {
  const inputDataNotAvailable = !taskInputData || Object.keys(taskInputData).length === 0;

  if (loadingTask) {
    return (
      <WidgetBox>
        <GeneralInformationSkeleton />
      </WidgetBox>
    );
  }

  const renderedTitle = !noHeadline ? (
    <Typography variant="h3">{i18next.t('taskDetails.generalInformation.title')}</Typography>
  ) : null;

  return (
    <WidgetBox title={renderedTitle} collapsible hasDivider>
      {inputDataNotAvailable && i18next.t('taskDetails.generalInformation.noInformation')}
      {!inputDataNotAvailable && (
        <Grid container spacing={1}>
          {Object.keys(taskInputData).map(key => {
            return (
              <Grid item xs={12} md={6}>
                <div key={key}>
                  <Typography variant="body1">
                    <span className={classes.label}>{i18next.t(`task.inputData.${key}`)}:</span>
                    {taskInputData[key]}
                  </Typography>
                </div>
              </Grid>
            );
          })}
        </Grid>
      )}
    </WidgetBox>
  );
};

GeneralInformation.propTypes = {
  classes: PropTypes.shape({
    divider: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
  taskInputData: PropTypes.shape(),
  loadingTask: PropTypes.bool,
  noHeadline: PropTypes.bool,
};

GeneralInformation.defaultProps = {
  taskInputData: null,
  loadingTask: false,
  noHeadline: false,
};

export default withStyles(styles)(GeneralInformation);
