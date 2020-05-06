import { ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import Container from '@material-ui/core/Container';

import theme from 'theme';
import withAuth from 'components/common/auth/withAuth';
import WidgetBox from 'components/common/WidgetBox';

class ProcessListContainer extends React.Component {
  state = {
    // processes: [],
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Container disableGutters>
          <WidgetBox title="Process List" collapsible hasDivider>
            <h1>Process List</h1>
          </WidgetBox>
        </Container>
      </ThemeProvider>
    );
  }
}

export default withAuth(ProcessListContainer);
