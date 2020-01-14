import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { withTheme } from 'react-jsonschema-form';
import { Theme as MuiTheme } from 'rjsf-material-ui';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import CustomEventContext from 'components/TaskDetails/CustomEventContext';
import CompletionFormSkeleton from 'components/TaskCompletionForm/CompletionFormSkeleton';
import CompletionFormTitle from 'components/TaskCompletionForm/CompletionFormTitle';

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
    display: 'grid',
    gridTemplateColumns: '50% 50%',
  },
};

const CompletionForm = ({ classes, loading, formSchema, formData, uiSchema }) => {
  if (loading) {
    return <CompletionFormSkeleton />;
  }

  if (!loading && !formSchema) {
    return i18next.t('messages.warnings.noData');
  }

  const ThemedForm = withTheme(MuiTheme);

  const fields = {
    // eslint-disable-next-line react/jsx-props-no-spreading
    TitleField: props => <CompletionFormTitle {...props} />,
  };

  return (
    <CustomEventContext.Consumer>
      {({ onSubmitForm }) => (
        <div>
          {loading && <CompletionFormSkeleton />}
          {!loading && (
            <ThemedForm
              schema={formSchema}
              uiSchema={uiSchema}
              fields={fields}
              formData={formData}
              onSubmit={e => onSubmitForm(e)}
            >
              <div className={classes.actionButtons}>
                <Button type="submit" variant="contained" color="primary">
                  {i18next.t('common.submit')}
                </Button>
              </div>
            </ThemedForm>
          )}
        </div>
      )}
    </CustomEventContext.Consumer>
  );
};

CompletionForm.propTypes = {
  classes: PropTypes.shape({
    actionButtons: PropTypes.string,
    divider: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool,
  formSchema: PropTypes.shape({}),
  formData: PropTypes.shape({}),
  uiSchema: PropTypes.shape({}),
};

CompletionForm.defaultProps = {
  loading: false,
  formSchema: null,
  formData: {},
  uiSchema: {},
};

export default withStyles(styles)(CompletionForm);
