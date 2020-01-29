import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  addNoteField: {
    width: '100%',
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

    return (
      <div>
        <TextField
          className={classes.addNoteField}
          id="standard-textarea"
          label={i18next.t('taskComments.addNote')}
          value={comment}
          onChange={this.onChangeComment}
          multiline
          rows="2"
          disabled={loading}
        />
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
