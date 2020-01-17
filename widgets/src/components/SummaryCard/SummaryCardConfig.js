import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, HelpBlock, Row, Col } from 'patternfly-react';

import { getConnections, getSummaries } from 'api/pda';
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
      knowledgeSource: '',
      selectedSummary: '',
    };

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
    this.onChangeSummary = this.onChangeSummary.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  async componentDidMount() {
    const { frameId, pageCode } = this.props;

    // getting list of Kie server connections
    const sourceList = await getConnections();
    this.setState({ sourceList: sourceList.payload });

    // getting existing configs
    const pageWidgetsConfigs = await getPageWidget(pageCode, frameId);

    const configs = pageWidgetsConfigs.payload && pageWidgetsConfigs.payload.config;
    if (configs && configs.knowledgeSource) {
      this.onChangeKnowledgeSource(configs.knowledgeSource, () => {
        if (configs.process) {
          this.onChangeSummary(configs.process);
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

  onChangeSummary(e, cb = () => {}) {
    const selectedSummary = e.target ? e.target.value : e;
    this.setState({ selectedSummary });

    cb();
  }

  async handleSave() {
    const { frameId, pageCode, widgetCode } = this.props;
    const { knowledgeSource, selectedSummary } = this.state;
    const [, containerId] = selectedSummary.split('@');

    const body = JSON.stringify({
      code: widgetCode,
      config: {
        knowledgeSource,
        process: selectedSummary,
        containerId,
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
    const { knowledgeSource, sourceList, summaryList = [], selectedSummary = '' } = this.state;

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
              <FormGroup controlId="connection">
                <ControlLabel>Summary</ControlLabel>
                <select
                  className="form-control"
                  value={selectedSummary}
                  onChange={this.onChangeProcess}
                >
                  <option value="">Select...</option>
                  {summaryList.map(process => (
                    <option
                      key={`${process['process-id']}@${process['container-id']}`}
                      value={`${process['process-id']}@${process['container-id']}`}
                    >
                      {`${process['process-name']} @ ${process['container-id']}`}
                    </option>
                  ))}
                </select>
                <HelpBlock>Select one Summary.</HelpBlock>
              </FormGroup>
            </Col>
          </Row>
          {selectedSummary && (
            <section>
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

export default SummaryCardConfig;
