/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  ControlLabel,
  Button,
  HelpBlock,
  Row,
  Col,
  FormControl,
} from 'patternfly-react';

import { getConnections, getProcess } from 'api/pda';
import { authenticate, getPageWidget, putPageWidget } from 'api/app-builder/pages';

import 'patternfly-react/dist/css/patternfly-react.css';
import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';

class CompletionFormConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceList: [],
      processList: [],
      settings: {
        uiSchema: '{}',
      },
      knowledgeSource: '',
      selectedProcess: '',
    };

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
    this.onChangeProcess = this.onChangeProcess.bind(this);
    this.onChangeUiSchema = this.onChangeUiSchema.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  async componentDidMount() {
    const { frameId, pageCode } = this.props;

    // getting list of Kie server connections
    const sourceList = await getConnections();
    this.setState({ sourceList: sourceList.payload });

    // temporary fetch for ease of development
    console.log('Fetching auth token for ease of development! DEV ONLY');
    const authentication = await authenticate();
    if (authentication && authentication.access_token) {
      localStorage.setItem('token', authentication.access_token);
    }

    // getting existing configs
    const pageWidgetsConfigs = await getPageWidget(pageCode, frameId);

    const configs = pageWidgetsConfigs.payload && pageWidgetsConfigs.payload.config;
    if (configs && configs.knowledgeSource) {
      this.onChangeKnowledgeSource(configs.knowledgeSource, () => {
        if (configs.process) {
          this.onChangeProcess(configs.process, () => {
            if (configs.settings) {
              this.setState({
                settings: JSON.parse(configs.settings),
              });
            }
          });
        }
      });
    }
  }

  onChangeKnowledgeSource(e, cb = () => {}) {
    const knowledgeSource = e.target ? e.target.value : e;
    this.setState({ knowledgeSource });

    getProcess(knowledgeSource).then(data => {
      this.setState({ processList: data.payload });

      cb();
    });
  }

  onChangeProcess(e, cb = () => {}) {
    const selectedProcess = e.target ? e.target.value : e;
    this.setState({ selectedProcess });

    cb();
  }

  onChangeUiSchema({ target: { value: uiSchema } }) {
    const { settings } = this.state;
    this.setState({ settings: { ...settings, uiSchema } });
  }

  async handleSave() {
    const { frameId, pageCode, widgetCode } = this.props;
    const { knowledgeSource, selectedProcess, settings } = this.state;
    const [, containerId] = selectedProcess.split('@');

    const body = JSON.stringify({
      code: widgetCode,
      config: {
        knowledgeSource,
        process: selectedProcess,
        containerId,
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
    const {
      knowledgeSource,
      sourceList,
      settings,
      processList = [],
      selectedProcess = '',
    } = this.state;

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
                <ControlLabel>Process</ControlLabel>
                <select
                  className="form-control"
                  value={selectedProcess}
                  onChange={this.onChangeProcess}
                >
                  <option value="">Select...</option>
                  {processList.map(process => (
                    <option
                      key={`${process['process-id']}@${process['container-id']}`}
                      value={`${process['process-id']}@${process['container-id']}`}
                    >
                      {`${process['process-name']} @ ${process['container-id']}`}
                    </option>
                  ))}
                </select>
                <HelpBlock>Select one BPM Process.</HelpBlock>
              </FormGroup>
            </Col>
          </Row>
          {selectedProcess && (
            <section>
              <legend>Settings</legend>
              <Row>
                <Col xs={12}>
                  <FormGroup bsClass="form-group" controlId="textarea">
                    <ControlLabel bsClass="control-label">UI Schema</ControlLabel>
                    <FormControl
                      bsClass="form-control"
                      componentClass="textarea"
                      value={settings.uiSchema}
                      onChange={this.onChangeUiSchema}
                    />
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

CompletionFormConfig.propTypes = {
  frameId: PropTypes.string.isRequired,
  widgetCode: PropTypes.string.isRequired,
  pageCode: PropTypes.string.isRequired,
};

export default CompletionFormConfig;
