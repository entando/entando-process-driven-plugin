import React from 'react';
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import i18next from 'i18next';
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
import CustomEventContext from 'components/SummaryCard/CustomEventContext';
import Skeleton from '@material-ui/lab/Skeleton';
import SummaryCardValues from 'components/SummaryCard/SummaryCardValues';

const styles = ({ palette }) => ({
  root: {
    background: '#FFF',
    borderTop: '4px solid #E7EAEC',
    color: '#676A6C',
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
    border: `2px solid ${palette.primary.main}`,
    padding: '4px 24px 4px 14px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    color: palette.primary.main,
  },
  periodSelectInputOutline: {
    '&$focused $notchedOutline': {
      border: 0,
    },
  },
  periodSelectIcon: {
    right: 3,
    color: palette.primary.main,
  },
  periodSelectItem: {
    fontSize: 12,
  },
});

class SummaryCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      loading: false,
      loadingValues: false,
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

    this.setState({ loading: true, loadingValues: true }, async () => {
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

      this.setState({
        loading: false,
        loadingValues: false,
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

  handlePeriodChange(event) {
    this.setState({ period: event.target.value, loadingValues: true }, () => this.fetchSummary());
  }

  renderSkeletonHeader() {
    const { classes } = this.props;
    return (
      <div className={classes.header}>
        <Skeleton width="100px" height={27} variant="rect" />
        <Skeleton width="60px" height={27} variant="rect" />
      </div>
    );
  }

  renderHeader() {
    const { period, summary } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.header}>
        <Typography variant="subtitle2" component="h3" className={classes.headline}>
          {i18next.t(`card.labels.${summary.title}`)}
        </Typography>
        <Select
          value={period}
          variant="outlined"
          classes={{
            root: classes.periodSelectRoot,
            outlined: classes.periodSelectInputOutline,
            iconOutlined: classes.periodSelectIcon,
          }}
          onChange={this.handlePeriodChange}
        >
          {['monthly', 'annual', 'daily'].map(periodi => (
            <MenuItem key={periodi} value={periodi} className={classes.periodSelectItem}>
              {i18next.t(`card.${periodi}`)}
            </MenuItem>
          ))}
        </Select>
      </div>
    );
  }

  render() {
    const { loading, loadingValues, summary } = this.state;
    const { classes, width, display, onError } = this.props;

    return (
      <CustomEventContext.Provider value={{ onError }}>
        <ThemeProvider theme={theme}>
          <Paper square elevation={0} className={classes.root} style={{ width, display }}>
            {loading && this.renderSkeletonHeader()}
            {!loading && summary && this.renderHeader()}
            <Divider className={classes.divider} />
            <SummaryCardValues loading={loadingValues} values={summary} />
          </Paper>
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
  display: PropTypes.string,
  summaryId: PropTypes.string.isRequired,
  onError: PropTypes.func,
  serviceUrl: PropTypes.string,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

SummaryCard.defaultProps = {
  onError: () => {},
  display: 'inline-block',
  width: 256,
  serviceUrl: '',
  pageCode: '',
  frameId: '',
  summaryId: 1,
};

export default withStyles(styles, { name: 'EntSummaryCard' })(SummaryCard);
