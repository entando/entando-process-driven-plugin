import React, { useState } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { withStyles } from '@material-ui/core/styles';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@material-ui/icons';

import EditDialog from './EditAddDialog';
import SchemaContainerControls from './SchemaContainerControls';

const styles = {
  container: {
    margin: '15px 0',
    paddingLeft: '15px',
    borderLeft: '4px solid #888888',
    fontSize: '12px',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  field: {
    flexGrow: 1,
    '& label, & input': {
      display: 'block',
    },
  },
  fieldLabel: {
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
  },
  expandButton: {
    border: '0px',
    padding: '0px',
    marginBottom: '5px',
    backgroundColor: 'inherit',
    display: 'flex',
    alignItems: 'center',
  },
  uiSchema: {
    width: '100%',
    fontFamily: 'monospace, monospace',
    fontSize: '12px',
    resize: 'vertical',
    backgroundColor: '#dddddd',
    cursor: 'not-allowed',
  },
};

const SchemaContainer = ({ classes, name, uiSchema, onChangeValues, onClickRemove }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showSchema, setShowSchema] = useState(false);

  const toggleShowSchema = () => setShowSchema(!showSchema);
  const handleClickEdit = () => setEditModalOpen(!editModalOpen);
  const handleClickRemove = () => onClickRemove(name);

  return (
    <div className={classes.container}>
      <div className={classes.top}>
        <div className={classes.field}>
          <div className={classes.fieldLabel}>{i18next.t('config.formSchemaId')}</div>
          <div>{name}</div>
        </div>
        <SchemaContainerControls
          name={name}
          onClickEdit={handleClickEdit}
          onClickRemove={handleClickRemove}
        />
      </div>
      <div className={classes.field}>
        <button type="button" onClick={toggleShowSchema} className={classes.expandButton}>
          <div className={classes.fieldLabel}>{i18next.t('config.uiSchema')}</div>
          {showSchema ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </button>
        {showSchema && <textarea disabled rows={5} className={classes.uiSchema} value={uiSchema} />}
      </div>
      <EditDialog
        isOpen={editModalOpen}
        onClickClose={handleClickEdit}
        onClickAccept={onChangeValues}
        formSchemaId={name}
        uiSchema={uiSchema}
      />
    </div>
  );
};

SchemaContainer.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
    top: PropTypes.string,
    field: PropTypes.string,
    fieldLabel: PropTypes.string,
    expandButton: PropTypes.string,
    uiSchema: PropTypes.string,
  }).isRequired,
  name: PropTypes.string,
  uiSchema: PropTypes.string,
  onChangeValues: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
};

SchemaContainer.defaultProps = {
  name: '',
  uiSchema: '',
};

export default withStyles(styles)(SchemaContainer);
