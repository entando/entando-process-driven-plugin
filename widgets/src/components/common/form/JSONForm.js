import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { withTheme } from 'react-jsonschema-form';
import { Theme as MuiRJSForm } from 'rjsf-material-ui';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import CustomEventContext from 'components/common/CustomEventContext';
import JSONFormSkeleton from 'components/common/form/JSONFormSkeleton';
import FieldTemplate from 'components/common/form/templates/FieldTemplate';
import generateColumnedOFT from 'components/common/form/templates/ObjectFieldTemplate';
import TextWidget from 'components/common/form/widgets/TextWidget';

const styles = {
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
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
    uiSchema,
    customization: { fields = {}, templates = {}, widgets = {}, columnSize = 12 },
  } = props;

  if (loading) {
    return <JSONFormSkeleton />;
  }

  if (!loading && !formSchema) {
    return i18next.t('messages.warnings.noFormSchema');
  }

  const ThemedForm = withTheme(MuiRJSForm);
  const ObjectFieldTemplate = generateColumnedOFT(columnSize);

  const customTemplates = {
    FieldTemplate,
    ObjectFieldTemplate,
    ...templates, // passed custom templates
  };

  const customWidgets = {
    TextWidget,
    ...widgets,
  };

  return (
    <CustomEventContext.Consumer>
      {({ onSubmitForm }) => (
        <div>
          {loading && <JSONFormSkeleton />}
          {!loading && (
            <ThemedForm
              schema={formSchema}
              uiSchema={uiSchema}
              fields={fields}
              {...customTemplates} // eslint-disable-line react/jsx-props-no-spreading
              widgets={customWidgets}
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
  formSchema: PropTypes.shape({}),
  formData: PropTypes.shape({}),
  uiSchema: PropTypes.shape({}),
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
    columnSize: PropTypes.number,
  }),
};

JSONForm.defaultProps = {
  loading: false,
  submitting: false,
  formSchema: null,
  formData: {},
  uiSchema: {},
  customization: {},
};

export default withStyles(styles)(JSONForm);
