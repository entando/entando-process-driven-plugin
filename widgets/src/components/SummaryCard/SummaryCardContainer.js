import React from 'react';
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import { DOMAINS, LOCAL } from 'api/constants';
import theme from 'theme';
import { getPageWidget } from 'api/app-builder/pages';
import { getSummary } from 'api/pda/summary';
import { HotTrend as HotTrendIcon, UpTrend as UpTrendIcon, DownTrend as DownTrendIcon } from 'components/common/Icons';
import CustomEventContext from 'components/SummaryCard/CustomEventContext';
import SummaryCardSkeleton from 'components/SummaryCard/SummaryCardSkeleton';

const styles = {
  root: {
    background: '#FFF',
    borderTop: '4px solid #E7EAEC',
    color: '#676A6C',
    '&.hotTrend $periodSelectRoot': {
      backgroundColor: '#1C84C6',
    },
    '&.upTrend $periodSelectRoot': {
      backgroundColor: '#23C6C8',
    },
    '&.downTrend $periodSelectRoot': {
      backgroundColor: '#ED5565',
    },
    '&.hotTrend $value': {
      color: '#1C84C6',
    },
    '&.upTrend $value': {
      color: '#23C6C8',
    },
    '&.downTrend $value': {
      color: '#ED5565',
    },
  },
  header: {
    display: 'flex',
    padding: '20px 25px',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headline: {
    fontWeight: 'bold',
  },
  periodSelectRoot: {
    border: 0,
    padding: '4px 24px 4px 14px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  periodSelectInputOutline: {
    '&$focused $notchedOutline': {
      border: 0,
    },
  },
  periodSelectIcon: {
    right: 3,
  },
  values: {
    display: 'flex',
    padding: '20px 25px',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  value: {
    fontWeight: 'bold',
  },
  valueIcon: {
    width: 13,
    height: 13,
    verticalAlign: 'middle',
  },
};

const trendMarkers = {
  hot: 50,
  up: 0,
  down: 0,
};

class SummaryCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      loading: false,
      summary: null,
      period: 'monthly',
      trend: 'up',
    };

    this.fetchSummary = this.fetchSummary.bind(this);
    this.fetchWidgetConfigs = this.fetchWidgetConfigs.bind(this);
    this.handlePeriodChange = this.handlePeriodChange.bind(this);
  }

  componentDidMount() {
    const { serviceUrl } = this.props;
    if (!LOCAL) {
      // set the PDA domain to the URL passed via props
      DOMAINS.PDA = serviceUrl;
    }

    this.setState({ loading: true }, async () => {
      const { config: storedConfig } = this.state;
      const config = storedConfig || (await this.fetchWidgetConfigs());

      this.setState({ config }, () => this.fetchSummary());
    });
  }

  async fetchWidgetConfigs() {
    const { pageCode, frameId } = this.props;
    try {
      // config will be fetched from app-builder
      const widgetConfigs = await getPageWidget(pageCode, frameId);
      if (widgetConfigs.errors && widgetConfigs.errors.length) {
        throw widgetConfigs.errors[0];
      }

      const { config } = widgetConfigs.payload;

      return config;
    } catch (error) {
      this.handleError(error.message);
    }
    return null;
  }

  async fetchSummary() {
    const { config, period } = this.state;
    const { summaryId } = this.props;

    const connection = (config && config.knowledgeSource) || '';
    const containerId = (config && config.containerId) || '';
    const summaryContainerId = `${summaryId}@${containerId}`;

    try {
      const summary = await getSummary(connection, summaryContainerId, period);

      console.log(summary);

      this.setState({
        loading: false,
        summary: (summary && summary.payload) || null,
      });
    } catch (error) {
      this.handleError(error.message);
    }
  }

  handleError(err) {
    const { onError } = this.props;
    onError(err);
  }

  checkTrend(value) {
    if (value >= trendMarkers.hot) {
      return 'hot';
    }
    if (value >= trendMarkers.up) {
      return 'up';
    }
    if (value < trendMarkers.down) {
      return 'down';
    }
    return '';
  }

  trendNotation(trend) {
    const { classes } = this.props;
    switch (trend) {
      case 'hot':
        return { class: classes.trendhot, icon: <HotTrendIcon className={classes.valueIcon} /> };
      case 'up':
        return { class: classes.trendup, icon: <UpTrendIcon className={classes.valueIcon} /> };
      case 'down':
        return { class: classes.trenddown, icon: <DownTrendIcon className={classes.valueIcon} /> };
      default:
        return { class: '', icon: null };
    }
  }

  handlePeriodChange(event) {
    console.log('event change', event.target.value);
    this.setState({ period: event.target.value }, () => this.fetchSummary());
  }

  render() {
    const { period, loading, summary } = this.state;
    const { classes, width, onError } = this.props;

    const percVal = summary && summary.percentage ? Math.round(summary.percentage * 100) : null;
    const percent = percVal ? `${percVal}%` : '-';

    const trend = this.checkTrend(percVal);
    console.log(percVal, trend);

    const { class: trendClass, icon: trendIcon } = this.trendNotation(trend);

    return (
      <CustomEventContext.Provider value={{ onError }}>
        <ThemeProvider theme={theme}>
          <div style={{ width }}>
            <Paper square elevation={0} className={classNames(classes.root, `${trend}Trend`)}>
              {loading && <SummaryCardSkeleton />}
              {!loading && summary && (
                <>
                  <div className={classes.header}>
                    <Typography variant="subtitle2" component="h3" className={classes.headline}>
                      {summary.title}
                    </Typography>
                    <Select
                      value={period}
                      variant="outlined"
                      classes={{
                        root: classes.periodSelectRoot,
                        outlined: classes.periodSelectRoot,
                        iconOutlined: classes.periodSelectIcon,
                      }}
                      onChange={this.handlePeriodChange}
                    >
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="annual">Annual</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                    </Select>
                  </div>
                  <Divider className={classes.divider} />
                  <div className={classes.values}>
                    <div>
                      <Typography variant="h4">{summary.total}</Typography>
                      <Typography variant="caption">{summary.totalLabel}</Typography>
                    </div>
                    <div>
                      <Typography variant="body2" className={classNames(classes.value, trendClass)}>
                        {percent} {trendIcon}
                      </Typography>
                    </div>
                  </div>
                </>
              )}
            </Paper>
          </div>
        </ThemeProvider>
      </CustomEventContext.Provider>
    );
  }
}

SummaryCard.propTypes = {
  classes: PropTypes.shape({
    summaryCardWidgetBox: PropTypes.string,
  }).isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  summaryId: PropTypes.string.isRequired,
  onError: PropTypes.func,
  serviceUrl: PropTypes.string,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

SummaryCard.defaultProps = {
  onError: () => {},
  width: 256,
  serviceUrl: '',
  pageCode: '',
  frameId: '',
  summaryId: 1,
};

export default withStyles(styles, { name: 'EntSummaryCard' })(SummaryCard);
