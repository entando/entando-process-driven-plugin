import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import i18next from 'i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import withAuth from '../common/auth/withAuth';
import { getTaskComments, postTaskComment, deleteTaskComment } from '../../api/pda/comments';
import { getPageWidget } from '../../api/app-builder/pages';
import theme from '../../theme';
import Notification from '../common/Notification';
import WidgetBox from '../common/WidgetBox';
import Comment from '../TaskComments/Comment';
import AddComment from '../TaskComments/AddComment';
import TaskCommentsSkeleton from '../TaskComments/TaskCommentsSkeleton';

const styles = {
  noComments: {
    marginTop: '10px',
  },
  commentContainer: {
    marginTop: '10px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
};

class TaskComments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      addingComment: false,
      config: {},
      comments: [],
      errorMessage: '',
    };

    this.closeNotification = this.closeNotification.bind(this);
    this.handleError = this.handleError.bind(this);
    this.fetchWidgetConfigs = this.fetchWidgetConfigs.bind(this);
    this.fetchComments = this.fetchComments.bind(this);
    this.onClickAddComment = this.onClickAddComment.bind(this);
    this.onClickRemoveComment = this.onClickRemoveComment.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true }, async () => {
      const fetchedConfig = await this.fetchWidgetConfigs();

      this.setState({ config: fetchedConfig }, () => this.fetchComments());
    });
  }

  componentDidUpdate = prevProps => {
    const { taskId } = this.props;
    if (prevProps.taskId !== taskId) {
      this.fetchComments();
    }
  };

  onClickAddComment(comment) {
    this.setState({ addingComment: true }, async () => {
      const { config, comments } = this.state;
      const { taskId, onClickAddComment } = this.props;
      const connection = (config && config.knowledgeSource) || '';

      try {
        const postResponse = await postTaskComment(connection, taskId, comment);
        this.setState({ comments: [...comments, postResponse.payload], addingComment: false });
      } catch (error) {
        this.handleError(error.message);
      }

      onClickAddComment(comment);
    });
  }

  async onClickRemoveComment(id) {
    const { config, comments } = this.state;
    const { taskId, onClickRemoveComment } = this.props;
    const connection = (config && config.knowledgeSource) || '';

    try {
      await deleteTaskComment(connection, taskId, id);
      this.setState({ comments: comments.filter(comment => comment.id !== id) });
    } catch (error) {
      this.handleError(error.message);
    }

    onClickRemoveComment(id);
  }

  closeNotification = () => {
    this.setState({ errorMessage: '' });
  };

  async fetchComments() {
    const { config } = this.state;
    const { taskId } = this.props;
    const connection = (config && config.knowledgeSource) || '';

    if (taskId && taskId.length) {
      try {
        const commentsResponse = await getTaskComments(connection, taskId);
        this.setState({ comments: commentsResponse.payload || [], loading: false });
      } catch (error) {
        this.handleError(error.message);
      }
    }
  }

  handleError(errorMessage) {
    this.setState({ errorMessage });
    const { onError } = this.props;
    onError(errorMessage);
  }

  async fetchWidgetConfigs() {
    const { pageCode, frameId } = this.props;
    try {
      // config will be fetched from app-builder
      const widgetConfigs = await getPageWidget(pageCode, frameId);
      if (widgetConfigs.errors && widgetConfigs.errors.length) {
        throw widgetConfigs.errors[0];
      }
      const { config } = widgetConfigs.payload;
      const settings = (config.settings && JSON.parse(config.settings)) || {};

      const parsedSettings = Object.keys(settings).reduce(
        (acc, settingKey) => ({
          ...acc,
          [settingKey]: JSON.parse(settings[settingKey]),
        }),
        {}
      );

      return {
        ...config,
        settings: parsedSettings,
      };
    } catch (error) {
      this.handleError(error.message);
    }
    return {};
  }

  render() {
    const { comments, loading, addingComment, errorMessage } = this.state;
    const { classes, taskId } = this.props;

    const hasComments = comments.length > 0;

    if (loading)
      return (
        <WidgetBox>
          <TaskCommentsSkeleton />
        </WidgetBox>
      );

    const renderedTitle = (
      <Typography variant="h3">
        {i18next.t('taskComments.title')} - {taskId}
      </Typography>
    );

    return (
      <ThemeProvider theme={theme}>
        <Container disableGutters>
          <WidgetBox title={renderedTitle} collapsible hasDivider>
            {!hasComments && (
              <Typography className={classes.noComments} variant="body1">
                {i18next.t('taskComments.noComments')}
              </Typography>
            )}
            {hasComments && (
              <div className={classes.commentContainer}>
                {comments.map(comment => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    onClickRemoveComment={this.onClickRemoveComment}
                  />
                ))}
              </div>
            )}
            <AddComment loading={addingComment} onClickAddComment={this.onClickAddComment} />
          </WidgetBox>
        </Container>
        <Notification type="error" message={errorMessage} onClose={this.closeNotification} />
      </ThemeProvider>
    );
  }
}

TaskComments.propTypes = {
  classes: PropTypes.shape({
    divider: PropTypes.string,
    noComments: PropTypes.string,
    commentContainer: PropTypes.string,
  }).isRequired,
  taskId: PropTypes.string.isRequired,
  onClickAddComment: PropTypes.func,
  onClickRemoveComment: PropTypes.func,
  onError: PropTypes.func,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

TaskComments.defaultProps = {
  onClickAddComment: () => {},
  onClickRemoveComment: () => {},
  onError: () => {},
  pageCode: '',
  frameId: '',
};

const TaskCommentsContainer = withStyles(styles)(TaskComments);

export default withAuth(TaskCommentsContainer, [
  'task-comments-list',
  'task-comments-get',
  'task-comments-create',
  'task-comments-delete',
]);
