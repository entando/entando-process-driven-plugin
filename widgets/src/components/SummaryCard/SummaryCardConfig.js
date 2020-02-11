/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, HelpBlock, Row, Col } from 'patternfly-react';
import i18next from 'i18next';

import { getConnections } from 'api/pda/connections';
import { getSummaryRepositories } from 'api/pda/summary';
import { getPageWidget, putPageWidget } from 'api/app-builder/pages'; // -----

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
      saveMode: false,
    };

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
    this.onChangeSettings = this.onChangeSettings.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  async componentDidMount() {
    let { config } = this.props;

    const saveMode = JSON.stringify(config) === '{}';

    // getting list of Kie server connections
    const sourceList = await getConnections();
    this.setState({ sourceList: sourceList.payload, saveMode });

    if (saveMode) {
      const { pageCode, frameId } = this.props;
      console.log(pageCode, frameId);
      const pageWidgetsConfigs = await getPageWidget(pageCode, frameId, 'SUMMARY_CARD');
      config = pageWidgetsConfigs.payload && pageWidgetsConfigs.payload.config;
    }

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

  async handleSave() {
    const { frameId, pageCode, widgetCode } = this.props;
    const {
      config: { knowledgeSource, settings },
    } = this.state;

    const body = JSON.stringify({
      code: widgetCode,
      config: {
        knowledgeSource,
        settings: JSON.stringify(settings),
      },
    });

    try {
      const response = await putPageWidget(pageCode, frameId, body);
      console.log('Configs got saved', response);
    } catch (error) {
      console.log('Error while saving configs', error);
    }
  }

  render() {
    const { sourceList, dataTypes, config, saveMode } = this.state;
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
              {saveMode && (
                <Row>
                  <Col xs={12} className="text-right">
                    <Button bsClass="btn" bsStyle="primary" onClick={this.handleSave}>
                      Save
                    </Button>
                  </Col>
                </Row>
              )}
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
  frameId: PropTypes.string,
  widgetCode: PropTypes.string,
  pageCode: PropTypes.string,
};

SummaryCardConfig.defaultProps = {
  frameId: '',
  widgetCode: '',
  pageCode: '',
};

export default SummaryCardConfig;
