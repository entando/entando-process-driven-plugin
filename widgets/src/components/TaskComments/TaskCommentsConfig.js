/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, HelpBlock, Row, Col } from 'patternfly-react';

import { getConnections } from 'api/pda/connections';
import Notification from 'components/common/Notification';

import 'patternfly-react/dist/css/patternfly-react.css';
import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';

class TaskCommentsConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceList: [],
      errorMessage: '',
      config: {
        knowledgeSource: '',
      },
    };

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.handleError = this.handleError.bind(this);
    this.fetchScreen = this.fetchScreen.bind(this);
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

  onChangeKnowledgeSource(e) {
    const { config } = this.state;
    const knowledgeSource = e.target ? e.target.value : e;
    this.setState({ config: { ...config, knowledgeSource } });
  }

  closeNotification = () => {
    this.setState({ errorMessage: '' });
  };

  handleError(errorMessage) {
    this.setState({ errorMessage });
  }

  fetchScreen() {
    const { config } = this.props;
    if (config && config.knowledgeSource) {
      this.onChangeKnowledgeSource(config.knowledgeSource);
    }
  }

  render() {
    const { sourceList, errorMessage, config } = this.state;
    const { knowledgeSource } = config;

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
        </form>
      </div>
    );
  }
}

TaskCommentsConfig.propTypes = {
  config: PropTypes.shape({
    knowledgeSource: PropTypes.string,
  }).isRequired,
};

export default TaskCommentsConfig;
