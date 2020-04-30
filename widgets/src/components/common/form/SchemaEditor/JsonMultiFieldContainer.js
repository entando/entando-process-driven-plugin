import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import SchemaContainer from 'components/common/form/SchemaEditor/SchemaContainer';
import AddDialog from 'components/common/form/SchemaEditor/EditAddDialog';

const styles = {
  addButton: {
    border: '0px',
    backgroundColor: 'inherit',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    fill: '#888888',
    '&:hover': {
      fill: '#555555',
    },
    '& > * + *': {
      marginLeft: '5px',
    },
  },
};

class JsonMultiFieldContainer extends React.Component {
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
    const uiSchemas = JSON.parse(schemas);

    const updatedUiSchemas = JSON.stringify([
      ...uiSchemas,
      { formSchemaId: name, uiSchema: schema },
    ]);
    onChange(updatedUiSchemas);
  }

  handleChangeValues(formSchemaId, name, schema) {
    const { schemas, onChange } = this.props;

    const uiSchemas = JSON.parse(schemas);
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

    const uiSchemas = JSON.parse(schemas);
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

    if (!schemas) {
      return <div>No stored UI schemas.</div>;
    }

    try {
      const uiSchemas = JSON.parse(schemas);

      return (
        <div>
          <div>
            <button
              type="button"
              onClick={this.toggleDialog}
              className={classes.addButton}
              title="Add new UI Schema"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="14" width="14">
                <path d="M490.667 85.333h-64v-64C426.667 9.551 417.115 0 405.333 0h-384C9.551 0 0 9.551 0 21.333V448c0 11.782 9.551 21.333 21.333 21.333h64v21.333c0 11.782 9.551 21.333 21.333 21.333h384c11.782 0 21.333-9.551 21.333-21.333v-384c.001-11.781-9.55-21.333-21.332-21.333zm-448 341.334v-384H384v42.667H106.667c-11.782 0-21.333 9.551-21.333 21.333v320H42.667zm426.666 42.666H128V128h341.333v341.333z" />
                <path d="M320 277.333V192c0-11.782-9.551-21.333-21.333-21.333-11.782 0-21.333 9.551-21.333 21.333v85.333H192c-11.782 0-21.333 9.551-21.333 21.333 0 11.782 9.551 21.333 21.333 21.333h85.333v85.333c0 11.782 9.551 21.333 21.333 21.333 11.782 0 21.333-9.551 21.333-21.333V320h85.333c11.782 0 21.333-9.551 21.333-21.333 0-11.782-9.551-21.333-21.333-21.333H320z" />
              </svg>
              <span>Add new schema</span>
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
    } catch (e) {
      return <div>Unfortunately, there is a problem with stored UI schemas.</div>;
    }
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
