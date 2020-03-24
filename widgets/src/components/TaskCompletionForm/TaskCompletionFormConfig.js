/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, HelpBlock, Row, Col, FormControl } from 'patternfly-react';

import { getConnections } from 'api/pda/connections';

import 'patternfly-react/dist/css/patternfly-react.css';
import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';

class CompletionFormConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceList: [],
      config: {
        knowledgeSource: '',
        settings: {
          uiSchema: '{}',
          defaultColumnSize: '',
        },
      },
    };

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
    this.onChangeUiSchema = this.onChangeUiSchema.bind(this);
    this.onChangeSettingValue = this.onChangeSettingValue.bind(this);
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

  onChangeKnowledgeSource(e, afterKnowledgeSourceChange = () => {}) {
    const { config } = this.state;
    const knowledgeSource = e.target ? e.target.value : e;
    this.setState({ config: { ...config, knowledgeSource } }, afterKnowledgeSourceChange);
  }

  onChangeUiSchema(e) {
    const {
      target: { value: uiSchema },
    } = e;

    const { config } = this.state;
    this.setState({
      config: {
        ...config,
        settings: { ...config.settings, uiSchema },
      },
    });
  }

  onChangeSettingValue(setting, e) {
    const value = e.state ? e.state.value : e.target.value;
    const { config } = this.state;
    this.setState({
      config: {
        ...config,
        settings: {
          ...config.settings,
          [setting]: value,
        },
      },
    });
  }

  fetchScreen() {
    const { config } = this.props;

    if (config && config.knowledgeSource) {
      this.onChangeKnowledgeSource(config.knowledgeSource, () => {
        if (config.settings) {
          const parsedSettings = JSON.parse(config.settings);
          this.setState({
            config: {
              ...config,
              settings: {
                ...parsedSettings,
                uiSchema: JSON.stringify(JSON.parse(parsedSettings.uiSchema), null, 2).replace(
                  '\\"',
                  '"'
                ),
              },
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
              <Col xs={12}>
                <FormGroup bsClass="form-group">
                  <ControlLabel bsClass="control-label">Default column size</ControlLabel>
                  <input
                    className="form-control"
                    type="number"
                    value={settings.defaultColumnSize}
                    onChange={event => {
                      this.onChangeSettingValue('defaultColumnSize', event);
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
          </section>
        </form>
      </div>
    );
  }
}

CompletionFormConfig.propTypes = {
  config: PropTypes.shape({
    knowledgeSource: PropTypes.string,
    process: PropTypes.string,
    settings: PropTypes.string,
  }).isRequired,
};

export default CompletionFormConfig;
