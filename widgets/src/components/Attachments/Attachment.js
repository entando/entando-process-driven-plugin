/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import withStyles from '@material-ui/core/styles/withStyles';

import ConfirmDialog from 'components/common/ConfirmDialog';

const styles = {
  listItem: {
    border: 'solid 1px #eee',
    marginBottom: 2,
    background: 'white',
    borderRadius: 3,
  },
  truncate: {
    display: 'block',
    overflow: 'hidden',
    width: '80%',
    textOverflow: 'ellipsis',
  },
  filename: {
    lineHeight: '24px',
  },
};

class Attachment extends React.Component {
  state = {
    dialogOpen: false,
  };

  handleDeleteDialog = () => {
    this.setState(state => ({ dialogOpen: !state.dialogOpen }));
  };

  render() {
    const { dialogOpen } = this.state;
    const { classes, item, onDelete, onDownload } = this.props;

    return (
      <>
        <ListItem className={classes.listItem}>
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText className={classes.truncate}>
            <Link className={classes.filename} onClick={onDownload(item)}>
              {item.name}
            </Link>
          </ListItemText>
          <ListItemSecondaryAction>
            <IconButton size="small" onClick={this.handleDeleteDialog}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ConfirmDialog
          title="Attachment exclusion"
          message={
            <>
              <Typography gutterBottom>
                {i18next.t('messages.warning.deleteFilePermanently')}
              </Typography>
              <Typography variant="body2">{item.name}</Typography>
            </>
          }
          open={dialogOpen}
          onClose={this.handleDeleteDialog}
          onConfirm={onDelete(item)}
          maxWidth="md"
        />
      </>
    );
  }
}

Attachment.propTypes = {
  classes: PropTypes.shape({
    listItem: PropTypes.string,
    truncate: PropTypes.string,
    filename: PropTypes.string,
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onDelete: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

Attachment.defaultProps = {
  classes: {},
  item: {},
};

export default withStyles(styles)(Attachment);
