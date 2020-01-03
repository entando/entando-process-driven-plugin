import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import OverviewHeader from 'components/TaskDetails/Overview/OverviewHeader';
import OverviewDetails from 'components/TaskDetails/Overview/OverviewDetails';
import OverviewSkeleton from 'components/TaskDetails/Overview/OverviewSkeleton';

const Overview = ({ task, loadingTask }) => {
  return (
    <div>
      {loadingTask && <OverviewSkeleton />}
      {!loadingTask && task && (
        <>
          <OverviewHeader
            title={`${i18next.t('taskDetails.overview.title')} - ${task['task-id']}`}
          />
          <OverviewDetails task={task} />
        </>
      )}
    </div>
  );
};

Overview.propTypes = {
  task: PropTypes.shape({
    'task-id': PropTypes.number,
  }),
  loadingTask: PropTypes.bool,
};

Overview.defaultProps = {
  task: null,
  loadingTask: false,
};

export default Overview;
