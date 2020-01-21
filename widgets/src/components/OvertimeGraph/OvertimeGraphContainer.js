import React, { Component } from 'react';
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import { Paper, Typography, Grid, Box } from '@material-ui/core';

import theme from 'theme';
import BarAreaChart from 'components/OvertimeGraph/BarAreaChart';

class OvertimeGraph extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Paper>
          <Box p={2}>
            <Typography variant="h5" gutterBottom>
              Requests Volume
            </Typography>
            <Grid container>
              <Grid item xs={8}>
                <Typography variant="subtitle1">Requests</Typography>
              </Grid>
              <Grid item xs={4}>
                tabs
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={8} style={{ height: '250px' }}>
                <BarAreaChart
                  data={[
                    { x: 'Jan 03', bar: 60, area: 8 },
                    { x: 'Jan 06', bar: 45, area: 5 },
                    { x: 'Jan 09', bar: 20, area: 10 },
                    { x: 'Jan 12', bar: 75, area: 15 },
                  ]}
                  legends={{
                    bar: 'Number of Requests',
                    area: 'Bookings Made',
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                details here
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </ThemeProvider>
    );
  }
}

export default OvertimeGraph;
