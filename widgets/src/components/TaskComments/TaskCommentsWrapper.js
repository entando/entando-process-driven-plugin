import withAuth from 'components/common/authentication/withAuth';
import TaskComments from 'components/TaskComments/TaskComments';

export default withAuth(TaskComments, [
  'task-comments-create',
  'task-comments-delete',
  'task-comments-list',
]);
