import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {
  container: {
    '& > div + div': {
      marginTop: '10px',
    },
  },
  field: {
    flexGrow: 1,
    '& label, & input': {
      display: 'block',
    },
  },
  note: {
    fontSize: '12px',
  },
  fieldLabel: {
    fontWeight: 600,
  },
  formSchemaId: {
    width: '100%',
  },
  uiSchema: {
    width: '100%',
    fontFamily: 'monospace, monospace',
    fontSize: '14px',
    resize: 'vertical',
  },
  invalid: {
    backgroundColor: '#ffc4b1',
  },
  disabled: {
    backgroundColor: '#dddddd',
  },
};

const EditDialog = ({
  classes,
  isOpen,
  isNew,
  onClickClose,
  onClickAccept,
  formSchemaId,
  uiSchema,
}) => {
  const [name, setName] = useState(formSchemaId);
  const [schema, setSchema] = useState(uiSchema);
  const [validName, setValidName] = useState(true);
  const [validSchema, setValidSchema] = useState(true);

  const validateJson = newSchema => {
    if (newSchema === '') {
      setValidSchema(true);
    } else {
      try {
        JSON.parse(newSchema);
        setValidSchema(true);
      } catch (e) {
        setValidSchema(false);
      }
    }
  };

  // reset values, if uiSchema or formSchemaId are updated from outside
  useEffect(() => setName(formSchemaId), [formSchemaId]);
  useEffect(() => setSchema(uiSchema), [uiSchema]);

  // validate schema on change
  useEffect(() => validateJson(schema), [schema]);

  const handleNameChange = ({ target: { value: newName } }) => {
    setName(newName);
    if (newName === '') {
      setValidName(false);
    } else {
      setValidName(true);
    }
  };
  const handleSchemaChange = ({ target: { value: newSchema } }) => setSchema(newSchema);

  // format JSON on blur event
  const handleBlur = ({ target: { value: currentValue } }) => {
    if (validSchema) {
      setSchema(JSON.stringify(JSON.parse(currentValue), null, 2));
    }
  };

  const handleClickAccept = () => {
    if (validName && validSchema) {
      onClickAccept(formSchemaId, name, JSON.parse(schema));
      onClickClose();
      setName('');
      setSchema('{}');
    }
  };

  const isDisabled = !validName || !validSchema || name === '';

  return (
    <Dialog
      open={isOpen}
      onClose={onClickClose}
      aria-labelledby="Edit UI schema"
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle id="form-dialog-title">
        {isNew ? 'Create UI schema' : 'Edit UI schema'}
      </DialogTitle>
      <DialogContent>
        <div className={classes.container}>
          <div className={classes.field}>
            <div className={classes.fieldLabel}>Form schema ID:</div>
            <div>
              <input
                required
                className={classNames(classes.formSchemaId, !validName && classes.invalid)}
                value={name}
                onChange={handleNameChange}
                onKeyDown={handleNameChange}
              />
              <span className={classes.note}>
                If you would like to create generic rules, use * as Form schema ID.
              </span>
            </div>
          </div>
          <div className={classes.field}>
            <div className={classes.fieldLabel}>UI Schema:</div>
            <textarea
              rows={10}
              className={classNames(classes.uiSchema, !validSchema && classes.invalid)}
              value={schema}
              onChange={handleSchemaChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickClose} color="primary">
          Cancel
        </Button>
        <Button disabled={isDisabled} onClick={handleClickAccept} color="primary">
          {isNew ? 'Add' : 'Change'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditDialog.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
    top: PropTypes.string,
    fieldLabel: PropTypes.string,
    note: PropTypes.string,
    field: PropTypes.string,
    formSchemaId: PropTypes.string,
    uiSchema: PropTypes.string,
    invalid: PropTypes.string,
  }).isRequired,
  formSchemaId: PropTypes.string,
  uiSchema: PropTypes.string,
  isNew: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  onClickClose: PropTypes.func.isRequired,
  onClickAccept: PropTypes.func.isRequired,
};

EditDialog.defaultProps = {
  isNew: false,
  formSchemaId: '',
  uiSchema: '{}',
};

export default withStyles(styles)(EditDialog);
