/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, HelpBlock, Row, Col } from 'patternfly-react';
import i18next from 'i18next';

import withAuth from 'components/common/authentication/withAuth';
import { getConnections } from 'api/pda/connections';
import { getSummaries } from 'api/pda/summary';
import { getPageWidget, putPageWidget } from 'api/app-builder/pages';

import 'patternfly-react/dist/css/patternfly-react.css';
import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';

class SummaryCardConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceList: [],
      summaryList: [],
      settings: { summaryId: '' },
      knowledgeSource: '',
    };

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
    this.onChangeSettings = this.onChangeSettings.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  async componentDidMount() {
    const { frameId, pageCode } = this.props;

    // getting list of Kie server connections
    const sourceList = await getConnections();
    this.setState({ sourceList: sourceList.payload });

    // getting existing configs
    const pageWidgetsConfigs = await getPageWidget(pageCode, frameId, 'SUMMARY_CARD');

    const configs = pageWidgetsConfigs.payload && pageWidgetsConfigs.payload.config;

    if (configs && configs.knowledgeSource) {
      this.onChangeKnowledgeSource(configs.knowledgeSource, () => {
        if (configs.settings) {
          this.setState({
            settings: JSON.parse(configs.settings),
          });
        }
      });
    }
  }

  onChangeKnowledgeSource(e, cb = () => {}) {
    const knowledgeSource = e.target ? e.target.value : e;
    this.setState({ knowledgeSource });

    getSummaries(knowledgeSource).then(data => {
      this.setState({ summaryList: data.payload });
      cb();
    });
  }

  onChangeSettings({ target: { value: summaryId } }) {
    this.setState({ settings: { summaryId } });
  }

  async handleSave() {
    const { frameId, pageCode, widgetCode } = this.props;
    const { knowledgeSource, settings } = this.state;

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
    const { knowledgeSource, sourceList, summaryList, settings } = this.state;

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
              <Row>
                <Col xs={12} className="text-right">
                  <Button bsClass="btn" bsStyle="primary" onClick={this.handleSave}>
                    Save
                  </Button>
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
  frameId: PropTypes.string.isRequired,
  widgetCode: PropTypes.string.isRequired,
  pageCode: PropTypes.string.isRequired,
};

export default withAuth(SummaryCardConfig, [
  'connection-list',
  'process-definition-list',
  'summary-list',
]);
