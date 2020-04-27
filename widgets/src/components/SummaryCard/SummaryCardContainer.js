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
import { getSummaryByType } from 'api/pda/summary';
import CustomEventContext from 'components/SummaryCard/CustomEventContext';
import Notification from 'components/common/Notification';
import Skeleton from '@material-ui/lab/Skeleton';
import SummaryCardValues from 'components/SummaryCard/SummaryCardValues';
import withAuth from 'components/common/auth/withAuth';

const styles = ({ palette }) => {
  return {
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
    frequencySelectRoot: {
      border: `2px solid ${palette.primary.main}`,
      padding: '4px 24px 4px 14px',
      borderRadius: 4,
      fontSize: 10,
      fontWeight: 'bold',
      color: palette.primary.main,
    },
    frequencySelectIcon: {
      right: 3,
      color: palette.primary.main,
    },
    frequencySelectItem: {
      fontSize: 12,
    },
  };
};

const FREQUENCIES = ['monthly', 'annually', 'daily'];

class SummaryCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      loading: false,
      loadingValues: false,
      summary: null,
      dataType: '',
      frequency: FREQUENCIES[0],
      errorMessage: '',
    };

    this.closeNotification = this.closeNotification.bind(this);
    this.handleError = this.handleError.bind(this);
    this.fetchSummary = this.fetchSummary.bind(this);
    this.fetchWidgetConfigs = this.fetchWidgetConfigs.bind(this);
    this.handleFrequencyChange = this.handleFrequencyChange.bind(this);
  }

  componentDidMount() {
    const { serviceUrl } = this.props;
    if (!LOCAL) {
      DOMAINS.PDA = serviceUrl;
    }

    this.setState({ loading: true, loadingValues: true }, async () => {
      const config = await this.fetchWidgetConfigs();

      this.setState({ config }, () => this.fetchSummary());
    });
  }

  closeNotification = () => {
    this.setState({ errorMessage: '' });
  };

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
    const { config, frequency } = this.state;

    const connection = (config && config.knowledgeSource) || '';
    const settings = (config && config.settings && JSON.parse(config.settings)) || {};
    const { type } = settings;

    try {
      const summary = await getSummaryByType(connection, 'Card', { type, frequency });

      this.setState({
        loading: false,
        loadingValues: false,
        dataType: type,
        summary: (summary && summary.payload) || null,
      });
    } catch (error) {
      this.handleError(error.message);
    }
  }

  handleError(errorMessage) {
    this.setState({ errorMessage });
    const { onError } = this.props;
    onError(errorMessage);
  }

  handleFrequencyChange(event) {
    this.setState({ frequency: event.target.value, loadingValues: true }, () =>
      this.fetchSummary()
    );
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
    const { frequency, dataType } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.header}>
        <Typography variant="subtitle2" component="h3" className={classes.headline}>
          {i18next.t(`summary.labels.${dataType}.title`)}
        </Typography>
        <Select
          value={frequency}
          variant="outlined"
          classes={{
            root: classes.frequencySelectRoot,
            iconOutlined: classes.frequencySelectIcon,
          }}
          onChange={this.handleFrequencyChange}
        >
          {FREQUENCIES.map(frequencyItem => (
            <MenuItem
              key={frequencyItem}
              value={frequencyItem}
              className={classes.frequencySelectItem}
            >
              {i18next.t(`summary.frequency.${frequencyItem}`)}
            </MenuItem>
          ))}
        </Select>
      </div>
    );
  }

  render() {
    const { loading, loadingValues, summary, dataType, errorMessage } = this.state;
    const { classes, onError } = this.props;

    return (
      <CustomEventContext.Provider value={{ onError }}>
        <Paper square elevation={0} className={classes.root}>
          {loading && this.renderSkeletonHeader()}
          {!loading && summary && this.renderHeader()}
          <Divider />
          <SummaryCardValues loading={loadingValues} dataType={dataType} values={summary} />
        </Paper>
        <Notification type="error" message={errorMessage} onClose={this.closeNotification} />
      </CustomEventContext.Provider>
    );
  }
}

SummaryCard.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    frequencySelectRoot: PropTypes.string.isRequired,
    frequencySelectIcon: PropTypes.string.isRequired,
    frequencySelectItem: PropTypes.string.isRequired,
  }).isRequired,
  onError: PropTypes.func,
  serviceUrl: PropTypes.string,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

SummaryCard.defaultProps = {
  onError: () => {},
  serviceUrl: '',
  pageCode: '',
  frameId: '',
};

const StyledSummaryCard = withStyles(styles)(SummaryCard);

const SummaryCardContainer = props => (
  <ThemeProvider theme={theme}>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <StyledSummaryCard {...props} />
  </ThemeProvider>
);

export default withAuth(SummaryCardContainer, ['summary-get']);
