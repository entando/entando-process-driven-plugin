import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { TextareaAutosize, Button, CircularProgress, Typography } from '@material-ui/core';

const MAX_CHARS = 200;

const styles = {
  addNoteField: {
    width: '100%',
    border: '1px solid #E5E6E7',
  },
  addNoteLabel: {
    color: '#A1A1A1',
    margin: '6px 2px',
  },
  addNoteLimit: {
    fontSize: '10px',
    margin: '2px',
  },
  actionButtons: {
    marginTop: '25px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

class AddComment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
    };

    this.onChangeComment = this.onChangeComment.bind(this);
    this.handleAddCommentClick = this.handleAddCommentClick.bind(this);
  }

  onChangeComment({ target: { value } }) {
    this.setState({ comment: value });
  }

  handleAddCommentClick() {
    const { comment } = this.state;
    if (comment.trim()) {
      const { onClickAddComment } = this.props;

      onClickAddComment(comment.trim());
    }
    this.setState({ comment: '' });
  }

  render() {
    const { comment } = this.state;
    const { classes, loading } = this.props;
    const remainingChars = MAX_CHARS - comment.length;

    return (
      <div>
        <label htmlFor="comment-entry" className={classes.addNoteLabel}>
          {i18next.t('taskComments.addNote')}
        </label>
        <TextareaAutosize
          id="comment-entry"
          className={classes.addNoteField}
          rowsMin={2}
          value={comment}
          onChange={this.onChangeComment}
          disabled={loading}
        />
        <Typography
          color={remainingChars < 0 ? 'error' : 'initial'}
          className={classes.addNoteLimit}
        >
          {i18next.t('taskComments.maxChars', { max: MAX_CHARS, rem: remainingChars })}
        </Typography>
        <div className={classes.actionButtons}>
          {loading ? (
            <Button disabled variant="outlined" color="primary">
              <CircularProgress size="20px" />
            </Button>
          ) : (
            <Button onClick={this.handleAddCommentClick} variant="outlined" color="primary">
              {i18next.t('common.add')}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

AddComment.propTypes = {
  classes: PropTypes.shape({
    addNoteField: PropTypes.string,
    addNoteLabel: PropTypes.string,
    addNoteLimit: PropTypes.string,
    actionButtons: PropTypes.string,
  }).isRequired,
  onClickAddComment: PropTypes.func,
  loading: PropTypes.bool,
};

AddComment.defaultProps = {
  onClickAddComment: () => {},
  loading: false,
};

export default withStyles(styles)(AddComment);
