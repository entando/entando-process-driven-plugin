import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { withStyles } from '@material-ui/core/styles';
import { QueueOutlined as AddIcon } from '@material-ui/icons';

import SchemaContainer from 'components/common/form/SchemaEditor/SchemaContainer';
import AddDialog from 'components/common/form/SchemaEditor/EditAddDialog';

const styles = {
  addButton: {
    border: '0px',
    backgroundColor: 'inherit',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    '& > svg': {
      fill: '#888888',
    },
    '&:hover > svg': {
      fill: '#555555',
    },
    '& > * + *': {
      marginLeft: '5px',
    },
  },
};

class JsonMultiFieldContainer extends React.Component {
  static parseSchema(schema) {
    try {
      return JSON.parse(schema);
    } catch (e) {
      return [];
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      addDialogOpen: false,
    };

    this.toggleDialog = this.toggleDialog.bind(this);
    this.handleClickAddSchema = this.handleClickAddSchema.bind(this);
    this.handleChangeValues = this.handleChangeValues.bind(this);
    this.handleClickRemove = this.handleClickRemove.bind(this);
  }

  toggleDialog() {
    const { addDialogOpen } = this.state;
    this.setState({ addDialogOpen: !addDialogOpen });
  }

  handleClickAddSchema(formSchemaId, name, schema) {
    const { schemas, onChange } = this.props;
    const uiSchemas = JsonMultiFieldContainer.parseSchema(schemas);

    const updatedUiSchemas = JSON.stringify([
      ...uiSchemas,
      { formSchemaId: name, uiSchema: schema },
    ]);
    onChange(updatedUiSchemas);
  }

  handleChangeValues(formSchemaId, name, schema) {
    const { schemas, onChange } = this.props;

    const uiSchemas = JsonMultiFieldContainer.parseSchema(schemas);
    const updatedUiSchemas = JSON.stringify(
      uiSchemas.map(iteratedSchema =>
        iteratedSchema.formSchemaId === formSchemaId
          ? { formSchemaId: name, uiSchema: schema }
          : iteratedSchema
      ),
      null,
      2
    );

    onChange(updatedUiSchemas);
  }

  handleClickRemove(formSchemaId) {
    const { schemas, onChange } = this.props;

    const uiSchemas = JsonMultiFieldContainer.parseSchema(schemas);
    const updatedUiSchemas = JSON.stringify(
      uiSchemas.filter(iteratedSchema => iteratedSchema.formSchemaId !== formSchemaId),
      null,
      2
    );

    onChange(updatedUiSchemas);
  }

  render() {
    const { addDialogOpen } = this.state;
    const { classes, schemas } = this.props;

    const uiSchemas = JsonMultiFieldContainer.parseSchema(schemas);

    return (
      <div>
        <div>
          <button
            type="button"
            onClick={this.toggleDialog}
            className={classes.addButton}
            title={i18next.t('config.addNewSchemaTitle')}
          >
            <AddIcon fontSize="small" />
            <span>{i18next.t('config.addNewSchema')}</span>
          </button>
        </div>
        {uiSchemas.map(({ formSchemaId, uiSchema }) => (
          <SchemaContainer
            key={formSchemaId}
            name={formSchemaId}
            uiSchema={JSON.stringify(uiSchema, null, 2)}
            onChangeValues={this.handleChangeValues}
            onClickRemove={this.handleClickRemove}
          />
        ))}
        <AddDialog
          isNew
          isOpen={addDialogOpen}
          onClickClose={this.toggleDialog}
          onClickAccept={this.handleClickAddSchema}
        />
      </div>
    );
  }
}

JsonMultiFieldContainer.propTypes = {
  classes: PropTypes.shape({
    addSchema: PropTypes.string,
    addButton: PropTypes.string,
  }).isRequired,
  schemas: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

JsonMultiFieldContainer.defaultProps = {
  schemas: '',
};

export default withStyles(styles)(JsonMultiFieldContainer);
