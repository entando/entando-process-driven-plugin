import React, { Component } from 'react';
import { MuiThemeProvider as ThemeProvider, withStyles } from '@material-ui/core/styles';
import { Paper, Typography, Grid, Box, Tabs, Tab, Divider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import theme from 'theme';
import BarAreaChart from 'components/OvertimeGraph/BarAreaChart';
import DataSummary from 'components/OvertimeGraph/DataSummary';

const ThickDivider = withStyles({
  root: {
    height: 4,
  },
})(Divider);

const StyledTabs = withStyles({
  indicator: {
    display: 'none',
  },
})(Tabs);

const StyledTab = withStyles({
  root: {
    minWidth: 64,
    border: '1px solid #E7EAEC',
    '&:first-child': {
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    '&:last-child': {
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    },
  },
  selected: {
    color: '#1C84C6',
  },

  // eslint-disable-next-line react/jsx-props-no-spreading
})(props => <Tab disableRipple {...props} />);

class OvertimeGraph extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      selectedTab: 0,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 1000);
  }

  handleTabChange = (event, value) => {
    this.setState({
      selectedTab: value,
    });
  };

  render() {
    const { loading, selectedTab } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <Paper>
          <Box p={2}>
            {loading ? (
              <Skeleton width={250} />
            ) : (
              <Typography variant="h5">Requests Volume</Typography>
            )}
          </Box>
          <Divider />
          <ThickDivider variant="middle" />
          <Box p={2}>
            <Grid container>
              <Grid item xs={8}>
                <Typography variant="subtitle1">
                  {loading ? (
                    <Skeleton width={100} />
                  ) : (
                    <Box fontWeight="fontWeightBold">Requests</Box>
                  )}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                {loading ? null : (
                  <StyledTabs value={selectedTab} onChange={this.handleTabChange} centered>
                    <StyledTab label="Today" />
                    <StyledTab label="Monthly" />
                    <StyledTab label="Annual" />
                  </StyledTabs>
                )}
              </Grid>
            </Grid>
            <Box my={1}>
              <Divider />
            </Box>
            <Grid container>
              <Grid item xs={8} style={{ height: '300px' }}>
                {loading ? (
                  <Skeleton variant="rect" height="100%" />
                ) : (
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
                )}
              </Grid>
              <Grid item xs={4}>
                <Box mb={1}>
                  <DataSummary
                    value={2346}
                    label="Total requests this year"
                    percent={48}
                    trend="up"
                    loading={loading}
                  />
                </Box>
                <Box mb={1}>
                  <DataSummary
                    value={1422}
                    label="Bookings in the last month"
                    percent={60}
                    trend="up"
                    loading={loading}
                  />
                </Box>
                <DataSummary
                  value="$109,180"
                  label="Annual income from requests"
                  percent={22}
                  trend="down"
                  loading={loading}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </ThemeProvider>
    );
  }
}

export default OvertimeGraph;
