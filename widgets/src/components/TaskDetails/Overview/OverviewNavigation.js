import React from 'react';
import i18next from 'i18next';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';

import CustomEventContext from 'components/TaskDetails/CustomEventContext';

const OverviewNavigation = () => {
  return (
    <CustomEventContext.Consumer>
      {({ onPressPrevious, onPressNext }) => (
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button startIcon={<ArrowBack />} onClick={onPressPrevious}>
            {i18next.t('taskDetails.overview.previous')}
          </Button>
          <Button endIcon={<ArrowForward />} onClick={onPressNext}>
            {i18next.t('taskDetails.overview.next')}
          </Button>
        </ButtonGroup>
      )}
    </CustomEventContext.Consumer>
  );
};

export default OverviewNavigation;
