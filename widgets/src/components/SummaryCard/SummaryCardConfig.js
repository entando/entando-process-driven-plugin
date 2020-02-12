/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, HelpBlock, Row, Col } from 'patternfly-react';
import i18next from 'i18next';

import { getConnections } from 'api/pda/connections';
import { getSummaries } from 'api/pda/summary';

import 'patternfly-react/dist/css/patternfly-react.css';
import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';

class SummaryCardConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceList: [],
      summaryList: [],
      config: {
        settings: { summaryId: '' },
        knowledgeSource: '',
      },
    };

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
    this.onChangeSettings = this.onChangeSettings.bind(this);
  }

  async componentDidMount() {
    const { config } = this.props;

    // getting list of Kie server connections
    const sourceList = await getConnections();
    this.setState({ sourceList: sourceList.payload });

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

  onChangeKnowledgeSource(e, cb = () => {}) {
    const { config } = this.state;
    const knowledgeSource = e.target ? e.target.value : e;
    this.setState({ config: { ...config, knowledgeSource } });

    getSummaries(knowledgeSource).then(data => {
      this.setState({ summaryList: data.payload });
      cb();
    });
  }

  onChangeSettings({ target: { value: summaryId } }) {
    const { config } = this.state;

    this.setState({
      config: {
        ...config,
        settings: { summaryId },
      },
    });
  }

  render() {
    const { sourceList, summaryList, config } = this.state;
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
                    <ControlLabel bsClass="control-label">Summary</ControlLabel>
                    <select
                      className="form-control"
                      value={settings.summaryId}
                      onChange={this.onChangeSettings}
                    >
                      <option value="">Select...</option>
                      {summaryList.map(summary => (
                        <option key={summary.id} value={summary.id}>
                          {i18next.t(`card.labels.${summary.description}`)}
                        </option>
                      ))}
                    </select>
                    <HelpBlock>Choose a summary to display information on your card.</HelpBlock>
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
