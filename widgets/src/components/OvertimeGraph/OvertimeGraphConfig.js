/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button, HelpBlock, Row, Col } from 'patternfly-react';

import { getConnections } from 'api/pda/connections';

import { getPageWidget, putPageWidget } from 'api/app-builder/pages';

import 'patternfly-react/dist/css/patternfly-react.css';
import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';

class OvertimeGraphConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceList: [],
      knowledgeSource: '',
    };

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
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
      this.onChangeKnowledgeSource(configs.knowledgeSource);
    }
  }

  onChangeKnowledgeSource(e) {
    const knowledgeSource = e.target ? e.target.value : e;
    this.setState({ knowledgeSource });
  }

  async handleSave() {
    const { frameId, pageCode, widgetCode } = this.props;
    const { knowledgeSource } = this.state;

    const body = JSON.stringify({
      code: widgetCode,
      config: {
        knowledgeSource,
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
    const { knowledgeSource, sourceList } = this.state;

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

OvertimeGraphConfig.propTypes = {
  frameId: PropTypes.string.isRequired,
  widgetCode: PropTypes.string.isRequired,
  pageCode: PropTypes.string.isRequired,
};

export default OvertimeGraphConfig;
