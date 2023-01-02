import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import OverviewHeader from './OverviewHeader';
import OverviewDetails from './OverviewDetails';
import OverviewSkeleton from './OverviewSkeleton';
import WidgetBox from '../../common/WidgetBox';

const Overview = ({ task, loadingTask, headerLabel, taskLink }) => {
  return (
    <WidgetBox>
      {loadingTask && <OverviewSkeleton />}
      {!loadingTask && task && (
        <>
          <OverviewHeader
            title={`${i18next.t(headerLabel)} - ${task.workItemId || ''}`}
            taskLink={taskLink}
          />
          <OverviewDetails task={task} />
        </>
      )}
    </WidgetBox>
  );
};

Overview.propTypes = {
  task: PropTypes.shape({
    workItemId: PropTypes.number,
  }),
  loadingTask: PropTypes.bool,
  headerLabel: PropTypes.string,
  taskLink: PropTypes.string,
};

Overview.defaultProps = {
  task: null,
  loadingTask: false,
  headerLabel: 'taskDetails.overview.title',
  taskLink: null,
};

export default Overview;
