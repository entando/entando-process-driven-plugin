import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
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
    const { classes, item, onDelete, downloadLink } = this.props;

    return (
      <>
        <ListItem className={classes.listItem}>
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText className={classes.truncate}>
            <Link href={`${downloadLink}/${item.id}/download`} download>
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
          message={`Do you wish to delete this file permanently?\n${item.name}`}
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
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onDelete: PropTypes.func.isRequired,
  downloadLink: PropTypes.string.isRequired,
};

Attachment.defaultProps = {
  classes: {},
  item: {},
};

export default withStyles(styles)(Attachment);
