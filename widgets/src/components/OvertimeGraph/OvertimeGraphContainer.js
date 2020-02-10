import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider as ThemeProvider, withStyles } from '@material-ui/core/styles';
import { Paper, Typography, Grid, Box, Tabs, Tab, Divider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import theme from 'theme';
import BarAreaChart from 'components/OvertimeGraph/BarAreaChart';
import DataSummary from 'components/OvertimeGraph/DataSummary';
import CustomEventContext from 'components/OvertimeGraph/CustomEventContext';
import { getPageWidget } from 'api/app-builder/pages';
import { getSummaryByType } from 'api/pda/summary';
import { DOMAINS, LOCAL } from 'api/constants';

const roundTo2Dec = num => Math.round((num + Number.EPSILON) * 100) / 100;

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

const PERIODS = {
  DAILY: 30,
  MONTHLY: 12,
  ANNUALLY: 10,
};

class OvertimeGraph extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      selectedTab: 'DAILY',
      summary: {},
      config: {},
    };

    this.handleError = this.handleError.bind(this);
  }

  async componentDidMount() {
    const { serviceUrl } = this.props;
    if (!LOCAL) {
      // set the PDA domain to the URL passed via props
      DOMAINS.PDA = serviceUrl;
    }

    await this.fetchWidgetConfigs();
    await this.fetchSummary();
  }

  handleTabChange = (event, value) => {
    this.setState({ selectedTab: value }, () => {
      this.fetchSummary();
    });
  };

  async fetchWidgetConfigs() {
    const { pageCode, frameId } = this.props;
    try {
      const widgetConfigs = await getPageWidget(pageCode, frameId);
      if (widgetConfigs.errors && widgetConfigs.errors.length) {
        throw widgetConfigs.errors[0];
      }

      const { config } = widgetConfigs.payload || { config: {} };

      this.setState({
        config,
      });
    } catch (error) {
      this.handleError(error.message);
    }
  }

  async fetchSummary() {
    const { config, selectedTab } = this.state;
    const connection = (config && config.knowledgeSource) || '';
    const periods = (config && config.periods) || PERIODS[selectedTab];
    const series = (config && config.series) || ['requests', 'cases'];
    const bodyPayload = {
      frequency: selectedTab,
      periods,
      series,
    };

    try {
      const { payload } = await getSummaryByType(connection, 'Chart', bodyPayload);

      this.setState({
        loading: false,
        summary: payload,
      });
    } catch (error) {
      this.handleError(error.message);
    }
  }

  handleError(err) {
    const { onError } = this.props;
    onError(err);
  }

  render() {
    const { onError } = this.props;
    const { loading, selectedTab, config, summary } = this.state;
    const title = config.title || 'Requests Volume';
    const subtitle = config.subtitle || 'Requests';
    const seriesLabel1 = (config.seriesLabels && config.seriesLabels[0]) || 'Number of Requests';
    const seriesLabel2 = (config.seriesLabels && config.seriesLabels[1]) || 'Bookings Made';
    const series1 = (summary.series && summary.series[0]) || { values: [] };
    const series2 = (summary.series && summary.series[1]) || { values: [] };
    const graphData = series1.values.map(({ date, value }, i) => ({
      x: date,
      bar: value,
      area: series2.values[i].value,
    }));
    const cardValue1 = (series1.card && series1.card.value) || 0;
    const cardValue2 = (series1.card && series2.card.value) || 0;
    const cardPercent1 =
      (series1.card && roundTo2Dec(Math.abs(series1.card.percentage * 100))) || 0;
    const cardPercent2 =
      (series2.card && roundTo2Dec(Math.abs(series2.card.percentage * 100))) || 0;
    const trend1 =
      series1.card && cardPercent1 ? (series1.card.percentage < 0 ? 'down' : 'up') : 'none';
    const trend2 =
      series2.card && cardPercent2 ? (series2.card.percentage < 0 ? 'down' : 'up') : 'none';

    return (
      <CustomEventContext.Provider value={{ onError }}>
        <ThemeProvider theme={theme}>
          <Paper>
            <Box p={2}>
              {loading ? <Skeleton width={250} /> : <Typography variant="h5">{title}</Typography>}
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
                      <Box fontWeight="fontWeightBold">{subtitle}</Box>
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  {loading ? null : (
                    <StyledTabs value={selectedTab} onChange={this.handleTabChange} centered>
                      <StyledTab value="DAILY" label="Daily" />
                      <StyledTab value="MONTHLY" label="Monthly" />
                      <StyledTab value="ANNUALLY" label="Annually" />
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
                      data={graphData}
                      legends={{
                        bar: seriesLabel1,
                        area: seriesLabel2,
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={4}>
                  <Box mb={1}>
                    <DataSummary
                      value={cardValue1}
                      label="Total requests this year"
                      percent={cardPercent1}
                      trend={trend1}
                      loading={loading}
                    />
                  </Box>
                  <Box mb={1}>
                    <DataSummary
                      value={cardValue2}
                      label="Bookings in the last month"
                      percent={cardPercent2}
                      trend={trend2}
                      loading={loading}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </ThemeProvider>
      </CustomEventContext.Provider>
    );
  }
}

OvertimeGraph.propTypes = {
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
  serviceUrl: PropTypes.string,
  onError: PropTypes.func,
};

OvertimeGraph.defaultProps = {
  pageCode: '',
  frameId: '',
  serviceUrl: '',
  onError: () => {},
};

export default OvertimeGraph;
