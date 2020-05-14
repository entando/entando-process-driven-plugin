import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, HelpBlock, Row, Col } from 'patternfly-react';

import { getConnections } from 'api/pda/connections';
import { getProcessDefinitions } from 'api/pda/processes';
import Notification from 'components/common/Notification';

class ProcessListConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceList: [],
      processList: [],
      errorMessage: '',
      config: {
        knowledgeSource: '',
        settings: {
          processDefinitionId: '',
        },
      },
    };

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
    this.fetchScreen = this.fetchScreen.bind(this);
    this.fetchProcesses = this.fetchProcesses.bind(this);
    this.handleProcessChange = this.handleProcessChange.bind(this);
  }

  async componentDidMount() {
    try {
      // getting list of Kie server connections
      const sourceList = await getConnections();
      this.setState({ sourceList: sourceList.payload }, this.fetchScreen);
    } catch (error) {
      this.handleError(error.message);
    }
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
    this.setState({ config: { ...config, knowledgeSource } }, cb);
  }

  fetchScreen() {
    const { config } = this.props;

    if (config && config.knowledgeSource) {
      this.onChangeKnowledgeSource(config.knowledgeSource, this.fetchProcesses);
    }
  }

  async fetchProcesses() {
    const { config } = this.state;

    try {
      const processList = await getProcessDefinitions(config.knowledgeSource);
      this.setState({ processList: processList.payload });
    } catch (error) {
      this.handleError(error.message);
    }
  }

  handleProcessChange({ target: { value } }) {
    this.setState(state => ({
      config: {
        ...state.config,
        settings: {
          ...state.config.settings,
          processDefinitionId: value,
        },
      },
    }));
  }

  handleError(errorMessage) {
    this.setState({ errorMessage });
  }

  render() {
    const { sourceList, config, processList, errorMessage } = this.state;
    const { knowledgeSource, settings } = config;

    return (
      <div>
        <Notification type="error" message={errorMessage} onClose={this.closeNotification} />
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
                    <ControlLabel bsClass="control-label">Process definition</ControlLabel>
                    <select
                      className="form-control"
                      value={settings.processDefinitionId}
                      onChange={this.handleProcessChange}
                    >
                      <option value="">Select...</option>
                      {processList.map(process => (
                        <option key={process['process-id']} value={process['process-id']}>
                          {process['process-name']}
                        </option>
                      ))}
                    </select>
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

ProcessListConfig.propTypes = {
  config: PropTypes.shape({
    knowledgeSource: PropTypes.string,
  }),
};

ProcessListConfig.defaultProps = {
  config: {},
};

export default ProcessListConfig;
