import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { FormGroup, ControlLabel, HelpBlock, Row, Col } from 'patternfly-react';

import JsonMultiFieldContainer from 'components/common/form/SchemaEditor/JsonMultiFieldContainer';

import { getConnections } from 'api/pda/connections';
import { getProcesses } from 'api/pda/processes';

class ProcessFormConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,

      sourceList: null,
      processList: null,

      config: {
        settings: {
          uiSchemas: '[]',
        },
        knowledgeSource: '',
        process: '',
      },
    };

    this.fetchOnLoad = this.fetchOnLoad.bind(this);
    this.fetchFromKnowledgeSource = this.fetchFromKnowledgeSource.bind(this);
    this.fetchFromProcesses = this.fetchFromProcesses.bind(this);

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
    this.onChangeProcess = this.onChangeProcess.bind(this);
    this.onChangeUiSchemas = this.onChangeUiSchemas.bind(this);
  }

  componentDidMount() {
    this.fetchOnLoad();
  }

  componentDidUpdate(prevProps) {
    const { config } = this.props;

    // refill state if passed (props) config changes
    if (JSON.stringify(config) !== JSON.stringify(prevProps.config)) {
      this.fetchOnLoad();
    }
  }

  onChangeKnowledgeSource({ target: { value: selectedKnowledgeSource } }) {
    const { config } = this.state;

    this.setState({ loading: true }, async () => {
      // fetching all the values that depend on connection (knowledgeSource)
      // in this case, it's only processes
      const availableProcesses = await this.fetchFromProcesses(selectedKnowledgeSource);

      this.setState({
        loading: false,

        ...availableProcesses,

        config: {
          ...config,
          knowledgeSource: selectedKnowledgeSource,
          process: '',
        },
      });
    });
  }

  onChangeProcess({ target: { value } }) {
    const { config } = this.state;

    this.setState({
      config: {
        ...config,
        process: value,
      },
    });
  }

  onChangeUiSchemas(uiSchemas) {
    const { config } = this.state;
    this.setState({
      config: {
        ...config,
        settings: { ...config.settings, uiSchemas },
      },
    });
  }

  fetchOnLoad() {
    const { config } = this.props;

    // getting list of Kie server connections
    this.setState({ loading: true }, async () => {
      const {
        sourceList = null,
        selectedKnowledgeSource = '',
        processList = null,
        selectedProcess = '',
      } = await this.fetchFromKnowledgeSource();

      const parsedSettings = config.settings ? JSON.parse(config.settings) : {};

      this.setState({
        loading: false,

        sourceList,
        processList,

        config: {
          ...config,
          settings: parsedSettings,
          knowledgeSource: selectedKnowledgeSource,
          process: selectedProcess,
        },
      });
    });
  }

  async fetchFromKnowledgeSource() {
    const {
      config: { knowledgeSource },
    } = this.props;

    const { payload: sourceList } = await getConnections();

    // checking if connection (knowledgeSource) was previously selected and exists in the
    // list of available connections - processes are defined per connection
    const isSelectable =
      knowledgeSource &&
      sourceList.some(iteratedConnection => iteratedConnection.name === knowledgeSource);

    if (isSelectable) {
      // fetching all the values that depend on connection (knowledgeSource),
      // in this case it's only processes
      const availableProcesses = await this.fetchFromProcesses(knowledgeSource);

      return {
        sourceList,
        selectedKnowledgeSource: knowledgeSource,
        ...availableProcesses,
      };
    }

    // if previously selected connection (knowledgeSource) is not available, it should be deselected
    return {
      sourceList,
      selectedKnowledgeSource: '',
    };
  }

  async fetchFromProcesses(connection) {
    if (connection) {
      const {
        config: { process },
      } = this.props;

      const { payload: processList } = await getProcesses(connection);

      // checking if connection (knowledgeSource) was previously selected and exists in the
      // list of available connections - processes are defined per connection
      const isSelectable =
        process &&
        processList.some(
          ({ 'process-id': processId, 'container-id': containerId }) =>
            `${processId}@${containerId}` === process
        );

      // fetching other values that depend on both connection (knowledgeSource)
      // and process could be done here by further chaining them

      return {
        processList,
        ...(isSelectable ? { selectedProcess: process } : { selectedProcess: '' }),
      };
    }
    return {};
  }

  render() {
    const { config, sourceList, processList, loading } = this.state;
    const { knowledgeSource, process: selectedProcess = '', settings } = config;

    return (
      <div>
        <form>
          <Row>
            <Col xs={12}>
              <FormGroup controlId="connection">
                <ControlLabel>{i18next.t('config.knowledgeSource')}</ControlLabel>
                <select
                  disabled={loading}
                  className="form-control"
                  value={knowledgeSource}
                  onChange={this.onChangeKnowledgeSource}
                >
                  <option disabled value="">
                    {i18next.t('config.selectOption')}
                  </option>
                  {sourceList.map(source => (
                    <option key={source.name} value={source.name}>
                      {source.name}
                    </option>
                  ))}
                </select>
                <HelpBlock>{i18next.t('config.selectConnections')}</HelpBlock>
              </FormGroup>
              <FormGroup controlId="connection">
                <ControlLabel>Process</ControlLabel>
                <select
                  disabled={loading}
                  className="form-control"
                  value={selectedProcess}
                  onChange={this.onChangeProcess}
                >
                  <option disabled value="">
                    {i18next.t('config.selectOption')}
                  </option>
                  {processList &&
                    processList.map(process => (
                      <option
                        key={`${process['process-id']}@${process['container-id']}`}
                        value={`${process['process-id']}@${process['container-id']}`}
                      >
                        {`${process['process-name']} @ ${process['container-id']}`}
                      </option>
                    ))}
                </select>
                <HelpBlock>{i18next.t('config.selectBpmProcess')}</HelpBlock>
              </FormGroup>
            </Col>
          </Row>
          {selectedProcess && (
            <section>
              <legend>{i18next.t('config.settings')}</legend>
              <Row>
                <Col xs={12}>
                  <FormGroup bsClass="form-group" controlId="textarea">
                    <ControlLabel bsClass="control-label">
                      {i18next.t('config.uiSchemas')}
                    </ControlLabel>
                    <JsonMultiFieldContainer
                      schemas={settings.uiSchemas}
                      onChange={this.onChangeUiSchemas}
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

ProcessFormConfig.propTypes = {
  config: PropTypes.shape({
    knowledgeSource: PropTypes.string,
    process: PropTypes.string,
    settings: PropTypes.string,
  }),
};

ProcessFormConfig.defaultProps = {
  config: {},
};

export default ProcessFormConfig;
