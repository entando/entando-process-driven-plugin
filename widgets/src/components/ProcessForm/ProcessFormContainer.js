import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import theme from 'theme';
import CustomEventContext from 'components/TaskDetails/CustomEventContext';
import WidgetBox from 'components/common/WidgetBox';

import ProcessForm from 'components/ProcessForm/ProcessForm';

class ProcessFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      loading: false,
      formData: {},
    };
  }

  render() {
    const { onSubmitForm, onError } = this.props;

    return (
      <CustomEventContext.Provider value={{ onSubmitForm, onError }}>
        <ThemeProvider theme={theme}>
          <Container disableGutters>
            <WidgetBox>
              <ProcessForm />
            </WidgetBox>
          </Container>
        </ThemeProvider>
      </CustomEventContext.Provider>
    );
  }
}

ProcessFormContainer.propTypes = {
  onError: PropTypes.func,
  onSubmitForm: PropTypes.func,
};

ProcessFormContainer.defaultProps = {
  onError: () => {},
  onSubmitForm: () => {},
};

export default ProcessFormContainer;