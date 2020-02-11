/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, HelpBlock, Row, Col } from 'patternfly-react';

import { getConnections } from 'api/pda/connections';
import { getProcesses } from 'api/pda/processes';
import ErrorNotification from 'components/common/ErrorNotification';

import 'patternfly-react/dist/css/patternfly-react.css';
import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';

class TaskCommentsConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceList: [],
      processList: [],
      errorMessage: '',
      config: {
        knowledgeSource: '',
        process: '',
      },
    };

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
    this.onChangeProcess = this.onChangeProcess.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  async componentDidMount() {
    try {
      const { config } = this.props;

      // getting list of Kie server connections
      const sourceList = await getConnections();
      this.setState({ sourceList: sourceList.payload });

      if (config && config.knowledgeSource) {
        this.onChangeKnowledgeSource(config.knowledgeSource, () => {
          if (config.process) {
            this.onChangeProcess(config.process);
          }
        });
      }
    } catch (error) {
      this.handleError(error.message);
    }
  }

  onChangeKnowledgeSource(e, cb = () => {}) {
    const { config } = this.state;
    const knowledgeSource = e.target ? e.target.value : e;
    this.setState({ config: { ...config, knowledgeSource } });

    getProcesses(knowledgeSource).then(data => {
      this.setState({ processList: data.payload });

      cb();
    });
  }

  onChangeProcess(e, cb = () => {}) {
    const { config } = this.state;
    const process = e.target ? e.target.value : e;
    this.setState({ config: { ...config, process } });

    cb();
  }

  closeNotification = () => {
    this.setState({ errorMessage: '' });
  };

  handleError(errorMessage) {
    this.setState({ errorMessage });
  }

  render() {
    const { sourceList, processList = [], errorMessage, config } = this.state;
    const { knowledgeSource, process: selectedProcess = '' } = config;

    return (
      <div>
        <ErrorNotification message={errorMessage} onClose={this.closeNotification} />
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
        </form>
      </div>
    );
  }
}

TaskCommentsConfig.propTypes = {
  config: PropTypes.shape({
    knowledgeSource: PropTypes.string,
    process: PropTypes.string,
  }).isRequired,
};

export default TaskCommentsConfig;
