/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, HelpBlock, Row, Col } from 'patternfly-react';
import i18next from 'i18next';

import { getConnections } from 'api/pda/connections';
import { getSummaryRepositories } from 'api/pda/summary';

import 'patternfly-react/dist/css/patternfly-react.css';
import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';

class SummaryCardConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceList: [],
      dataTypes: [],
      config: {
        settings: { type: '' },
        knowledgeSource: '',
      },
    };

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
    this.onChangeSettings = this.onChangeSettings.bind(this);
    this.fetchScreen = this.fetchScreen.bind(this);
  }

  async componentDidMount() {
    // getting list of Kie server connections
    const sourceList = await getConnections();
    this.setState({ sourceList: sourceList.payload }, this.fetchScreen);
  }

  componentDidUpdate(prevProps) {
    const { config } = this.props;

    // refetch state if config changes
    if (JSON.stringify(config) !== JSON.stringify(prevProps.config)) {
      this.fetchScreen();
    }
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

  onChangeSettings({ target: { value: type } }) {
    const { config } = this.state;
    this.setState({
      config: {
        ...config,
        settings: { type },
      },
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

  render() {
    const { sourceList, dataTypes, config } = this.state;
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
                  <FormGroup bsClass="form-group" controlId="textarea">
                    <ControlLabel bsClass="control-label">Data Type</ControlLabel>
                    <select
                      className="form-control"
                      value={settings.type}
                      onChange={this.onChangeSettings}
                    >
                      <option value="">Select...</option>
                      {dataTypes.map(summary => (
                        <option key={summary} value={summary}>
                          {i18next.t(`summary.labels.${summary}.title`)}
                        </option>
                      ))}
                    </select>
                    <HelpBlock>Choose a data type to display information on your card.</HelpBlock>
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

SummaryCardConfig.propTypes = {
  config: PropTypes.shape({
    knowledgeSource: PropTypes.string,
    settings: PropTypes.string,
  }).isRequired,
};

export default SummaryCardConfig;
