import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { FormGroup, ControlLabel, HelpBlock, Row, Col } from 'patternfly-react';

import { getConnections } from '../../api/pda/connections';
import JsonMultiFieldContainer from '../common/form/SchemaEditor/JsonMultiFieldContainer';

class ProcessDefinitionConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,

      sourceList: [],
      config: {
        settings: {
          uiSchemas: '[]',
        },
        knowledgeSource: '',
      },
    };

    this.fetchOnLoad = this.fetchOnLoad.bind(this);
    this.fetchFromKnowledgeSource = this.fetchFromKnowledgeSource.bind(this);

    this.onChangeKnowledgeSource = this.onChangeKnowledgeSource.bind(this);
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

  onChangeKnowledgeSource({ target: { value } }) {
    const { config } = this.state;

    this.setState({
      config: {
        ...config,
        knowledgeSource: value,
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
      } = await this.fetchFromKnowledgeSource();

      const parsedSettings = config.settings ? JSON.parse(config.settings) : {};

      this.setState({
        loading: false,

        sourceList,

        config: {
          ...config,
          settings: parsedSettings,
          knowledgeSource: selectedKnowledgeSource,
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

    // fetching other values (like process) that depend on connection (knowledgeSource)
    // could be done here by further chaining them (for an example, refer to ProcessForm)

    // if previously selected connection (knowledgeSource) is not available, it should be deselected
    return {
      sourceList,
      ...(isSelectable
        ? { selectedKnowledgeSource: knowledgeSource }
        : { selectedKnowledgeSource: '' }),
    };
  }

  render() {
    const { config, sourceList, loading } = this.state;
    const { knowledgeSource, settings } = config;

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
            </Col>
          </Row>
          {knowledgeSource && (
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

ProcessDefinitionConfig.propTypes = {
  config: PropTypes.shape({
    knowledgeSource: PropTypes.string,
    settings: PropTypes.string,
  }),
};

ProcessDefinitionConfig.defaultProps = {
  config: {},
};

export default ProcessDefinitionConfig;
