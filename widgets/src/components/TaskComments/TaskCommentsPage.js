import React from 'react';
import PropTypes from 'prop-types';

const TaskCommentsPage = ({ frameId, pageCode, taskId, serviceUrl }) => {
  return (
    <task-comments
      task-id={taskId}
      page-code={pageCode}
      frame-id={frameId}
      service-url={serviceUrl}
    />
  );
};

TaskCommentsPage.propTypes = {
  frameId: PropTypes.string,
  pageCode: PropTypes.string,
  taskId: PropTypes.string.isRequired,
  serviceUrl: PropTypes.string,
};

TaskCommentsPage.defaultProps = {
  frameId: '',
  pageCode: '',
  serviceUrl: '',
};

export default TaskCommentsPage;
