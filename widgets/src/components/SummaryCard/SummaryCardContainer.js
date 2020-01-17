import React from 'react';
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import { SERVICE } from 'api/constants';
import theme from 'theme';
import classNames from 'classnames';
import WidgetBox from 'components/common/WidgetBox';
import CustomEventContext from 'components/SummaryCard/CustomEventContext';
// import SummaryCardSkeleton from 'components/SummaryCard/SummaryCardSkeleton';

const styles = {
  root: {
    padding: 0,
    border: 0,
    borderTop: '4px solid #E7EAEC',
  },
  header: {
    display: 'flex',
    padding: '20px 25px',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodSelectRoot: {
    border: 0,
    backgroundColor: '#1C84C6',
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
  valueIcon: {
    verticalAlign: 'middle',
  },
};

const BoltIcon = props => (
  <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6.91208 3.84435C6.84678 3.77905 6.75971 3.73552 6.66539 3.73552C6.63637 3.73552 6.60734 3.74277 6.57832 3.75003L3.70511 4.46107L4.94582 1.10174C4.96758 1.05821 4.98209 1.01467 4.98209 0.97114C4.98209 0.804262 4.83698 0.666406 4.65559 0.666406H2.27576C2.1234 0.666406 1.9928 0.760728 1.95652 0.898584L0.498146 6.88444C0.476379 6.98602 0.505402 7.09485 0.592469 7.16741C0.650513 7.21819 0.73758 7.24722 0.817392 7.24722C0.846414 7.24722 0.875436 7.24722 0.904459 7.23996L3.85022 6.50715L2.42087 12.3697C2.3846 12.522 2.47892 12.6744 2.63854 12.7252C2.67482 12.7324 2.7111 12.7397 2.74012 12.7397C2.87072 12.7397 2.98681 12.6671 3.04485 12.5583L6.96287 4.1636C7.01366 4.05476 6.99189 3.93142 6.91208 3.84435Z" fill="#1C84C6"/>
  </svg>
);

const DownIcon = props => (
  <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M0.997315 0.366849C0.910248 0.366849 0.823181 0.424893 0.786903 0.504704C0.750626 0.584516 0.757881 0.686094 0.815926 0.751394L1.97682 2.14447C2.02761 2.19525 2.09291 2.22428 2.15821 2.22428H4.47999V6.86785H3.08692C2.90553 6.86785 2.74591 6.97668 2.6661 7.13631C2.59354 7.30318 2.61531 7.49908 2.7314 7.63694L5.05318 10.4231C5.22732 10.6335 5.5901 10.6335 5.76423 10.4231L8.08602 7.63694C8.20211 7.49908 8.23113 7.30318 8.15132 7.13631C8.07151 6.97668 7.91188 6.86785 7.73049 6.86785H6.33742V0.606283C6.33742 0.475682 6.23584 0.366849 6.10524 0.366849H0.997315Z" fill="#ED5565"/>
  </svg>
);

const UpIcon = props => (
  <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7.38618 4.23054C7.46599 4.07092 7.43697 3.87502 7.32088 3.73716L4.99909 0.951021C4.82496 0.740609 4.46218 0.740609 4.28805 0.951021L1.96626 3.73716C1.85017 3.87502 1.82841 4.07092 1.90096 4.23054C1.98077 4.39742 2.1404 4.499 2.32179 4.499H3.71486V9.14257H1.39307C1.32777 9.14257 1.25522 9.17159 1.21168 9.22238L0.0507891 10.6155C-0.00725558 10.688 -0.0145112 10.7823 0.0217667 10.8694C0.0580446 10.9492 0.145112 11 0.232179 11H5.34011C5.47071 11 5.57229 10.8984 5.57229 10.7678V4.499H6.96536C7.14675 4.499 7.30637 4.39742 7.38618 4.23054Z" fill="#23C6C8"/>
  </svg>
);

class SummaryCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      loadingTask: false,
      task: null,
    };

    // this.fetchTask = this.fetchTask.bind(this);
    // this.fetchWidgetConfigs = this.fetchWidgetConfigs.bind(this);
  }

  componentDidMount() {
    const { serviceUrl } = this.props;
    SERVICE.URL = serviceUrl;

    // this.setState({ loadingTask: true }, async () => {
    //   const { config: storedConfig } = this.state;
    //   const config = storedConfig || (await this.fetchWidgetConfigs());

    //   this.setState({ config }, () => this.fetchTask());
    // });
  }

  async fetchWidgetConfigs() {
  }

  async fetchTask() {
  }

  handleError(err) {
    const { onError } = this.props;
    onError(err);
  }

  render() {
    // const { loadingTask, task, taskInputData } = this.state;
    const { classes, width, onError } = this.props;
    return (
      <CustomEventContext.Provider value={{ onError }}>
        <ThemeProvider theme={theme}>
          <div style={{ width }}>
            <WidgetBox passedClassName={classes.root}>
              <div className={classes.header}>
                <Typography variant="subtitle2">Requests</Typography>
                <Select
                  value="monthly"
                  variant="outlined"
                  classes={{
                    root: classes.periodSelectRoot,
                    outlined: classes.periodSelectRoot,
                    iconOutlined: classes.periodSelectIcon,
                    input: classes.periodSelectInputOutline,
                  }}>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="annual">Annual</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                </Select>
              </div>
              <Divider className={classes.divider} />
              <div className={classes.values}>
                <div>
                  <Typography variant="h4">2,123</Typography>
                  <Typography variant="caption">Total Requests</Typography>
                </div>
                <div>
                  <Typography variant="body2">98% <BoltIcon className={classes.valueIcon} /></Typography>
                </div>
              </div>
            </WidgetBox>
          </div>
        </ThemeProvider>
      </CustomEventContext.Provider>
    );
  }
};

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
  width: 242,
  serviceUrl: '',
  pageCode: '',
  frameId: '',
  summaryId: 1,
};

export default withStyles(styles, { name: 'EntSummaryCard' })(SummaryCard);
