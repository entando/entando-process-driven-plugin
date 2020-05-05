import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, HelpBlock, Row, Col } from 'patternfly-react';
import i18next from 'i18next';

import { getConnections } from 'api/pda/connections';
import RenderSwitch from 'components/common/RenderSwitch';

const headerLabels = ['taskDetails.overview.title', 'taskDetails.overview.detailsTitle'];

class TaskDetailsConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceList: [],
      config: {
        knowledgeSource: '',
        settings: {
          header: '',
          hasGeneralInformation: true,
          destinationPageCode: '',
        },
      },
    };

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
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
    this.setState({ config: { ...config, knowledgeSource } }, cb);
  }

  onChangeSettings = prop => e => {
    const { config } = this.state;
    const { settings } = config;
    const value = e.state ? e.state.value : e.target.value;
    this.setState({
      config: {
        ...config,
        settings: {
          ...settings,
          [prop]: value,
        },
      },
    });
  };

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
    const { sourceList, config } = this.state;
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
                  <FormGroup bsClass="form-group">
                    <ControlLabel bsClass="control-label">Header label</ControlLabel>
                    <select
                      className="form-control"
                      value={settings.header}
                      onChange={this.onChangeSettings('header')}
                    >
                      <option value="">Select...</option>
                      {headerLabels.map(label => (
                        <option key={label} value={label}>
                          {i18next.t(label)}
                        </option>
                      ))}
                    </select>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup bsClass="form-group">
                    <ControlLabel bsClass="control-label">
                      Page code for the Task Details destination link
                    </ControlLabel>
                    <input
                      className="form-control"
                      type="text"
                      value={settings.destinationPageCode}
                      onChange={this.onChangeSettings('destinationPageCode')}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FormGroup bsClass="form-group">
                    <ControlLabel bsClass="control-label">Show General Information</ControlLabel>
                    <RenderSwitch
                      id="showGeneralInformation"
                      label=""
                      checked={settings.hasGeneralInformation}
                      onChange={this.onChangeSettings('hasGeneralInformation')}
                    />
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

TaskDetailsConfig.propTypes = {
  config: PropTypes.shape({
    knowledgeSource: PropTypes.string,
    settings: PropTypes.string,
  }),
};

TaskDetailsConfig.defaultProps = {
  config: {},
};

export default TaskDetailsConfig;
