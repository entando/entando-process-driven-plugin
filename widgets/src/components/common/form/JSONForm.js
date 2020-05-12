import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles';
import { withTheme } from 'react-jsonschema-form';
import { Theme as MuiRJSForm } from 'rjsf-material-ui';

import Button from '@material-ui/core/Button';

import CustomEventContext from 'components/common/CustomEventContext';
import JSONFormSkeleton from 'components/common/form/JSONFormSkeleton';
import FieldTemplate from 'components/common/form/templates/FieldTemplate';
import generateColumnedOFT from 'components/common/form/templates/ObjectFieldTemplate';
import DateWidget from 'components/common/form/widgets/DateWidget';
import DateTimeWidget from 'components/common/form/widgets/DateTimeWidget';
import EmailWidget from 'components/common/form/widgets/EmailWidget';
import UpDownWidget from 'components/common/form/widgets/UpDownWidget';

const styles = {
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '10px',
  },
  divider: {
    marginTop: '20px',
    marginBottom: '10px',
  },
  themedForm: {
    '& .MuiInputBase-input.MuiInputBase-inputMultiline': {
      resize: 'vertical',
    },
  },
};

const JSONForm = props => {
  const {
    classes,
    loading,
    submitting,
    formSchema,
    formData,
    uiSchema: userUiSchema,
    uiSchemas: userDefinedUiSchemas,
    defaultColumnSize,
    customization: { fields = {}, templates = {}, widgets = {} },
  } = props;

  if (loading) {
    return <JSONFormSkeleton />;
  }

  if (!loading && !formSchema) {
    return i18next.t('messages.warnings.noFormSchema');
  }

  const formTheme = createMuiTheme({
    overrides: {
      MuiOutlinedInput: {
        root: {
          borderRadius: '0px',
        },
        multiline: {
          paddingTop: '0px',
          paddingBottom: '0px',
        },
        input: {
          paddingTop: '8px',
          paddingBottom: '8px',
        },
        inputMultiline: {
          paddingTop: '8px',
          paddingBottom: '8px',
        },
      },
      MuiFormLabel: {
        root: {
          display: 'none',
        },
      },
      MuiInputLabel: {
        root: {
          display: 'none',
        },
      },
    },

    props: {
      MuiFormControl: {
        hiddenLabel: true,
      },
      MuiTextField: {
        variant: 'outlined',

        // InputProps are applied to the Input element (FilledInput, OutlinedInput or Input depending variant prop value)
        InputProps: {
          notched: false,
        },

        // InputLabelProps are applied to the InputLabel element
        InputLabelProps: {
          shrink: true,
        },
      },
      MuiOutlinedInput: {
        notched: false,
      },
      MuiSelect: {
        size: 'small',
        variant: 'outlined',
      },
      MuiSlider: {
        marks: true,
        valueLabelDisplay: 'auto',
      },
      MuiCheckbox: {
        color: 'primary',
      },
    },
  });

  const ThemedForm = withTheme(MuiRJSForm);

  const ObjectFieldTemplate = generateColumnedOFT(defaultColumnSize);

  const customTemplates = {
    FieldTemplate,
    ObjectFieldTemplate,
    ...templates, // passed custom templates
  };

  const customWidgets = {
    DateWidget,
    DateTimeWidget,
    EmailWidget,
    UpDownWidget,
    ...widgets,
  };

  const schemaId = formSchema.$id;

  const getUiSchema = () => {
    if (userUiSchema) {
      return userUiSchema;
    }
    const matchingIdUserDefinedSchema = userDefinedUiSchemas.find(
      mapping => mapping.formSchemaId === schemaId
    );
    if (matchingIdUserDefinedSchema) {
      return matchingIdUserDefinedSchema.uiSchema;
    }
    const genericUserDefinedSchema = userDefinedUiSchemas.find(
      mapping => mapping.formSchemaId === '*'
    );
    if (genericUserDefinedSchema) {
      return genericUserDefinedSchema.uiSchema;
    }
    return {};
  };

  const uiSchema = getUiSchema();

  return (
    <CustomEventContext.Consumer>
      {({ onSubmitForm }) => (
        <div>
          {loading && <JSONFormSkeleton />}
          {!loading && (
            <ThemeProvider theme={formTheme}>
              <ThemedForm
                schema={formSchema}
                uiSchema={uiSchema}
                {...customTemplates} // eslint-disable-line react/jsx-props-no-spreading
                widgets={customWidgets}
                fields={fields}
                formData={formData}
                className={classes.themedForm}
                onSubmit={e => onSubmitForm(e)}
              >
                <div className={classes.actionButtons}>
                  <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                    {i18next.t(submitting ? 'messages.notify.submitting' : 'common.submit')}
                  </Button>
                </div>
              </ThemedForm>
            </ThemeProvider>
          )}
        </div>
      )}
    </CustomEventContext.Consumer>
  );
};

JSONForm.propTypes = {
  classes: PropTypes.shape({
    actionButtons: PropTypes.string,
    divider: PropTypes.string,
    themedForm: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool,
  submitting: PropTypes.bool,
  formSchema: PropTypes.shape({
    $id: PropTypes.string,
  }),
  formData: PropTypes.shape({}),
  uiSchema: PropTypes.shape({}),
  uiSchemas: PropTypes.arrayOf(
    PropTypes.shape({
      formSchemaId: PropTypes.string,
      uiSchema: PropTypes.shape({}),
    })
  ),
  customization: PropTypes.shape({
    fields: PropTypes.shape({
      SchemaField: PropTypes.elementType,
      TitleField: PropTypes.elementType,
      DescriptionField: PropTypes.elementType,
    }),
    templates: PropTypes.shape({
      FieldTemplate: PropTypes.elementType,
      ArrayFieldTemplate: PropTypes.elementType,
      ObjectFieldTemplate: PropTypes.elementType,
      ErrorList: PropTypes.elementType,
    }),
    widgets: PropTypes.shape({
      AltDateTimeWidget: PropTypes.elementType,
      AltDateWidget: PropTypes.elementType,
      CheckboxesWidget: PropTypes.elementType,
      CheckboxWidget: PropTypes.elementType,
      ColorWidget: PropTypes.elementType,
      DateTimeWidget: PropTypes.elementType,
      DateWidget: PropTypes.elementType,
      EmailWidget: PropTypes.elementType,
      FileWidget: PropTypes.elementType,
      HiddenWidget: PropTypes.elementType,
      PasswordWidget: PropTypes.elementType,
      RadioWidget: PropTypes.elementType,
      RangeWidget: PropTypes.elementType,
      SelectWidget: PropTypes.elementType,
      TextareaWidget: PropTypes.elementType,
      TextWidget: PropTypes.elementType,
      UpDownWidget: PropTypes.elementType,
      URLWidget: PropTypes.elementType,
    }),
  }),
  defaultColumnSize: PropTypes.number,
};

JSONForm.defaultProps = {
  loading: false,
  submitting: false,
  formSchema: null,
  formData: {},
  uiSchema: null,
  uiSchemas: [],
  defaultColumnSize: 12,
  customization: {},
};

export default withStyles(styles)(JSONForm);
