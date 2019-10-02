import React from 'react';
import i18next from 'i18next';
// import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/styles';

import Table from 'components/common/Table/Table';
import columns from 'mocks/taskList/columns';
import rows from 'mocks/taskList/rows';

import theme from 'theme';

export default class TaskList extends React.Component {
  componentDidMount() {
    // keep
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Paper>
          <Table
            title={i18next.t('table.title')}
            subtitle={i18next.t('table.subtitle')}
            columns={columns}
            rows={rows}
          />
        </Paper>
      </ThemeProvider>
    );
  }
}

// TaskList.propTypes = {
//   columns: PropTypes.arrayOf(PropTypes.object),
// };
