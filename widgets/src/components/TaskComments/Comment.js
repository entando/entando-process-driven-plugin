import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import Avatar from '@material-ui/core/Avatar';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  comment: {
    display: 'flex',
    padding: '5px 10px',
    margin: '10px 0px',
  },
  avatar: {
    margin: '0px 30px',
  },
  commentText: {
    fontSize: '13px',
    lineHeight: '15px',
    color: '#686C6E',
  },
  created: {
    fontSize: '10px',
    lineHeight: '12px',
    color: '#8B8888',
    marginTop: '10px',
    marginLeft: '7px',
  },
  removeAnswers: {
    marginLeft: '5px',
    marginRight: '5px',
  },
};

class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prompt: false,
    };

    this.togglePrompt = this.togglePrompt.bind(this);
    this.handleClickRemove = this.handleClickRemove.bind(this);
  }

  togglePrompt() {
    const { prompt } = this.state;
    this.setState({ prompt: !prompt });
  }

  handleClickRemove() {
    const {
      comment: { id },
      onClickRemoveComment,
    } = this.props;

    onClickRemoveComment(id);
  }

  render() {
    const { prompt } = this.state;
    const {
      classes,
      comment: { text, createdBy, createdAt },
    } = this.props;

    return (
      <div className={classes.comment}>
        <div className={classes.avatar}>
          <Avatar alt={createdBy} src="/" />
        </div>
        <div className={classes.commentText}>
          <div>{text}</div>
          <div className={classes.created}>
            {`${createdBy} - ${new Date(createdAt).toLocaleString(i18next.language || 'en')} - `}
            <span
              onClick={this.togglePrompt}
              onKeyPress={this.togglePrompt}
              role="button"
              tabIndex={0}
            >
              {i18next.t('taskComments.remove')}
            </span>
            {prompt && (
              <span>
                <span
                  onClick={this.handleClickRemove}
                  onKeyPress={this.handleClickRemove}
                  role="button"
                  tabIndex={0}
                  className={classes.removeAnswers}
                >
                  {i18next.t('common.yes')}
                </span>
                /
                <span
                  onClick={this.togglePrompt}
                  onKeyPress={this.togglePrompt}
                  role="button"
                  tabIndex={0}
                  className={classes.removeAnswers}
                >
                  {i18next.t('common.no')}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Comment.propTypes = {
  classes: PropTypes.shape({
    comment: PropTypes.string,
    avatar: PropTypes.string,
    commentText: PropTypes.string,
    created: PropTypes.string,
    removeAnswers: PropTypes.string,
  }).isRequired,
  comment: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
    createdBy: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onClickRemoveComment: PropTypes.func,
};

Comment.defaultProps = {
  onClickRemoveComment: () => {},
};

export default withStyles(styles)(Comment);
