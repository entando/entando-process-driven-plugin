import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, HelpBlock, Row, Col } from 'patternfly-react';

import { getConnections } from 'api/pda/connections';
import { getSummaryRepositories } from 'api/pda/summary';

import 'patternfly-react/dist/css/patternfly-react.css';
import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';

class OvertimeGraphConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceList: [],
      dataTypes: [],
      config: {
        knowledgeSource: '',
        settings: {
          dataType1: '',
          dataType2: '',
          dailyFreqPeriods: 1,
          monthlyFreqPeriods: 1,
          annualFreqPeriods: 1,
        },
      },
    };

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
    this.fetchScreen = this.fetchScreen.bind(this);
    this.handleSeriesDataTypeChange = this.handleSeriesDataTypeChange.bind(this);
    this.handleFreqPeriodsChange = this.handleFreqPeriodsChange.bind(this);
  }

  async componentDidMount() {
    // getting list of Kie server connections
    const sourceList = await getConnections();
    this.setState({ sourceList: sourceList.payload }, this.fetchScreen);
  }

  onChangeKnowledgeSource(e, cb = () => {}) {
    const { config } = this.state;
    const knowledgeSource = e.target ? e.target.value : e;
    this.setState({ config: { ...config, knowledgeSource } });

    getSummaryRepositories(knowledgeSource).then(data => {
      this.setState({ dataTypes: data.payload });
      cb();
    });
  }

  fetchScreen() {
    const { config } = this.props;

    if (config && config.knowledgeSource) {
      this.onChangeKnowledgeSource(config.knowledgeSource, () => {
        if (config.settings) {
          this.setState({
            config: {
              ...config,
              settings: JSON.parse(config.settings),
            },
          });
        }
      });
    }
  }

  handleSeriesDataTypeChange(series, value) {
    const { config } = this.state;
    const dataTypeKey = `dataType${series}`;
    this.setState({
      config: {
        ...config,
        settings: {
          ...config.settings,
          [dataTypeKey]: value,
        },
      },
    });
  }

  handleFreqPeriodsChange(freq, value) {
    const { config } = this.state;
    const freqPeriodsKey = `${freq}FreqPeriods`;
    this.setState({
      config: {
        ...config,
        settings: {
          ...config.settings,
          [freqPeriodsKey]: value,
        },
      },
    });
  }

  render() {
    const { config, sourceList, dataTypes } = this.state;
    const { knowledgeSource, settings } = config;

    return (
      <div>
        <form>
          <Row>
            <Col xs={12}>
              <FormGroup controlId="connection">
                <ControlLabel>Knowledge Source</ControlLabel>
                <select
                  className="form-control"
                  value={knowledgeSource}
                  onChange={this.onChangeKnowledgeSource}
                >
                  <option value="">Select...</option>
                  {sourceList.map(source => (
                    <option key={source.name} value={source.name}>
                      {source.name}
                    </option>
                  ))}
                </select>
                <HelpBlock>Select one of the Kie server connections.</HelpBlock>
              </FormGroup>
            </Col>
          </Row>
          {knowledgeSource && (
            <section>
              <legend>Settings</legend>
              <Row>
                <Col xs={12}>
                  <FormGroup bsClass="form-group">
                    <ControlLabel bsClass="control-label">Series 1 Data Type</ControlLabel>
                    <select
                      className="form-control"
                      value={settings.dataType1}
                      onChange={({ target: { value } }) => {
                        this.handleSeriesDataTypeChange(1, value);
                      }}
                    >
                      <option value="">Select...</option>
                      {dataTypes.map(dataType => (
                        <option key={dataType} value={dataType}>
                          {dataType}
                        </option>
                      ))}
                    </select>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup bsClass="form-group">
                    <ControlLabel bsClass="control-label">Series 2 Data Type</ControlLabel>
                    <select
                      className="form-control"
                      value={settings.dataType2}
                      onChange={({ target: { value } }) => {
                        this.handleSeriesDataTypeChange(2, value);
                      }}
                    >
                      <option value="">Select...</option>
                      {dataTypes.map(dataType => (
                        <option key={dataType} value={dataType}>
                          {dataType}
                        </option>
                      ))}
                    </select>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup bsClass="form-group">
                    <ControlLabel bsClass="control-label">Daily Frequency Periods</ControlLabel>
                    <input
                      className="form-control"
                      type="number"
                      value={settings.dailyFreqPeriods}
                      min={1}
                      onChange={({ target: { value } }) => {
                        this.handleFreqPeriodsChange('daily', value);
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup bsClass="form-group">
                    <ControlLabel bsClass="control-label">Monthly Frequency Periods</ControlLabel>
                    <input
                      className="form-control"
                      type="number"
                      value={settings.monthlyFreqPeriods}
                      min={1}
                      onChange={({ target: { value } }) => {
                        this.handleFreqPeriodsChange('monthly', value);
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup bsClass="form-group">
                    <ControlLabel bsClass="control-label">Annual Frequency Periods</ControlLabel>
                    <input
                      className="form-control"
                      type="number"
                      value={settings.annualFreqPeriods}
                      min={1}
                      onChange={({ target: { value } }) => {
                        this.handleFreqPeriodsChange('annual', value);
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </section>
          )}
        </form>
      </div>
    );
  }
}

OvertimeGraphConfig.propTypes = {
  config: PropTypes.shape({
    knowledgeSource: PropTypes.string,
    settings: PropTypes.string,
  }),
};

OvertimeGraphConfig.defaultProps = {
  config: {},
};

export default OvertimeGraphConfig;
