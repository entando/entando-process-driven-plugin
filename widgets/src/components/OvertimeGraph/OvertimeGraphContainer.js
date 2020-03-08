import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import i18next from 'i18next';
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

const formatDate = (dateStr, frequency) => {
  const date = moment(dateStr, 'YYYY-MM-DD');
  switch (frequency) {
    case 'DAILY':
      return date.format('MMM DD');
    case 'MONTHLY':
      return date.format('MMM YYYY');
    case 'ANNUALLY':
      return date.format('YYYY');
    default:
      return null;
  }
};

const ThickDivider = withStyles({
  root: {
    height: 4,
  },
})(Divider);

const StyledTabs = withStyles({
  root: {
    minHeight: 'unset',
  },
  indicator: {
    display: 'none',
  },
})(Tabs);

const StyledTab = withStyles({
  root: {
    minWidth: 64,
    minHeight: 'unset',
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
      selectedTab: 'DAILY',
      summary: {
        graphData: [],
        card1: {},
        card2: {},
      },
      summaryFetching: false,
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
    this.setState({
      summaryFetching: true,
    });

    const { config, selectedTab } = this.state;
    const connection = (config && config.knowledgeSource) || '';
    const settings = (config && config.settings && JSON.parse(config.settings)) || {};
    const periods =
      selectedTab === 'DAILY'
        ? settings.dailyFreqPeriods
        : selectedTab === 'MONTHLY'
        ? settings.monthlyFreqPeriods
        : settings.annualFreqPeriods;
    const series = [settings.dataType1, settings.dataType2];
    const bodyPayload = {
      frequency: selectedTab,
      periods,
      series,
    };

    try {
      const { payload } = await getSummaryByType(connection, 'TimeSeries', bodyPayload);

      if (payload) {
        const series1 = (payload.series && payload.series[0]) || { values: [] };
        const series2 = (payload.series && payload.series[1]) || { values: [] };
        const dataType1 = series1.dataType;
        const dataType2 = series2.dataType;
        const graphData = series1.values.reverse().map(({ date, value }, i) => ({
          x: formatDate(date, selectedTab),
          bar: value,
          area: series2.values[series2.values.length - 1 - i].value,
        }));
        const cardValue1 = (series1.card && series1.card.value) || 0;
        const cardValue2 = (series1.card && series2.card.value) || 0;
        const cardPercent1 =
          (series1.card && roundTo2Dec(Math.abs(series1.card.percentage * 100))) || 0;
        const cardPercent2 =
          (series2.card && roundTo2Dec(Math.abs(series2.card.percentage * 100))) || 0;
        const trend1 = cardPercent1 !== 100 ? (cardPercent1 < 100 ? 'down' : 'up') : 'none';
        const trend2 = cardPercent2 !== 100 ? (cardPercent2 < 100 ? 'down' : 'up') : 'none';
        const summary = {
          graphData,
          dataType1,
          dataType2,
          card1: {
            value: cardValue1,
            percent: cardPercent1,
            trend: trend1,
          },
          card2: {
            value: cardValue2,
            percent: cardPercent2,
            trend: trend2,
          },
        };

        this.setState({
          loading: false,
          summaryFetching: false,
          summary,
        });
      }
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
    const { loading, selectedTab, summary, summaryFetching } = this.state;
    const { graphData, dataType1, dataType2, card1, card2 } = summary;

    return (
      <CustomEventContext.Provider value={{ onError }}>
        <ThemeProvider theme={theme}>
          <Paper>
            <Box p={2}>
              {loading ? (
                <Skeleton width={250} />
              ) : (
                <Typography variant="h2">{i18next.t(`summary.labels.chart.title`)}</Typography>
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
                      <Box fontWeight="fontWeightBold">
                        {i18next.t(`summary.labels.chart.subtitle`)}
                      </Box>
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  {loading ? null : (
                    <StyledTabs value={selectedTab} onChange={this.handleTabChange} centered>
                      <StyledTab value="DAILY" label={i18next.t(`summary.frequency.daily`)} />
                      <StyledTab value="MONTHLY" label={i18next.t(`summary.frequency.monthly`)} />
                      <StyledTab value="ANNUALLY" label={i18next.t(`summary.frequency.annually`)} />
                    </StyledTabs>
                  )}
                </Grid>
              </Grid>
              <Box my={1}>
                <Divider />
              </Box>
              <Grid container>
                <Grid item xs={8} style={{ height: '300px' }}>
                  {loading || summaryFetching ? (
                    <Skeleton variant="rect" height="100%" width="95%" />
                  ) : (
                    <BarAreaChart
                      data={graphData}
                      legends={{
                        bar: i18next.t(`summary.labels.chart.${dataType1}`),
                        area: i18next.t(`summary.labels.chart.${dataType2}`),
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={4}>
                  <Box mb={1}>
                    <DataSummary
                      value={card1.value}
                      label={i18next.t(`summary.labels.chart.card.${dataType1}`)}
                      percent={card1.percent}
                      trend={card1.trend}
                      loading={loading || summaryFetching}
                    />
                  </Box>
                  <Box mb={1}>
                    <DataSummary
                      value={card2.value}
                      label={i18next.t(`summary.labels.chart.card.${dataType2}`)}
                      percent={card2.percent}
                      trend={card2.trend}
                      loading={loading || summaryFetching}
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
