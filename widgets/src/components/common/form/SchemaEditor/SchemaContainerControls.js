import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { withStyles } from '@material-ui/core/styles';
import { EditOutlined as EditIcon, HighlightOffOutlined as RemoveIcon } from '@material-ui/icons';

const styles = {
  controls: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '30px',
    padding: '10px 10px',
    '& > div + div ': {
      marginLeft: '20px',
    },
  },
  button: {
    border: '0px',
    backgroundColor: 'inherit',
    display: 'flex',
    alignItems: 'center',
    '& > svg': {
      fill: '#888888',
    },
    '&:hover > svg': {
      fill: '#555555',
    },
    '& > * + *': {
      marginLeft: '3px',
    },
  },
};

const SchemaContainerControls = ({ classes, name, onClickEdit, onClickRemove }) => {
  const handleClickEdit = () => onClickEdit(name);
  const handleClickRemove = () => onClickRemove(name);

  return (
    <div className={classes.controls}>
      <button
        type="button"
        onClick={handleClickEdit}
        className={classes.button}
        title={i18next.t('config.editUiSchema')}
      >
        <EditIcon fontSize="small" />
        <span>{i18next.t('common.edit')}</span>
      </button>
      <button
        type="button"
        onClick={handleClickRemove}
        className={classes.button}
        title={i18next.t('config.removeUiSchema')}
      >
        <RemoveIcon fontSize="small" />
        <span>{i18next.t('common.remove')}</span>
      </button>
    </div>
  );
};

SchemaContainerControls.propTypes = {
  classes: PropTypes.shape({
    controls: PropTypes.string,
    button: PropTypes.string,
  }).isRequired,
  name: PropTypes.string.isRequired,
  onClickEdit: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
};

export default withStyles(styles)(SchemaContainerControls);
