import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { Close, Check } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getPageWidget, putPageWidget } from 'api/app-builder/pages';

const WidgetConfig = ({ children, config: passedConfig, ...rest }) => {
  const [loaded, setLoaded] = useState(false);
  const [code, setCode] = useState({});
  const [config, setConfig] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState({});
  const configRef = useRef(null);

  const { pageCode, frameId } = rest;

  const handleSaveClick = async () => {
    setSaving(true);

    const configState = configRef.current.state.config;
    const stringifiedConfig = Object.keys(configState).reduce((acc, setting) => {
      return {
        ...acc,
        [setting]:
          typeof configState[setting] === 'string'
            ? configState[setting]
            : JSON.stringify(configState[setting]),
      };
    }, {});
    const response = await putPageWidget(
      pageCode,
      frameId,
      JSON.stringify({ code, config: stringifiedConfig })
    );

    const noErrors = (response && response.errors && response.errors.length === 0) || false;
    setSaving(false);
    setSaved({ success: noErrors });
    setTimeout(() => {
      setSaved({});
    }, 2000);
  };

  useEffect(() => {
    async function fetchWidgetConfig() {
      if (passedConfig) {
        setCode(passedConfig.code);
        setConfig(passedConfig.config);
        setLoaded(true);
      } else {
        const widgetConfig = await getPageWidget(pageCode, frameId);
        setCode(widgetConfig.payload.code);
        setConfig(widgetConfig.payload.config);
        setLoaded(true);
      }
    }

    fetchWidgetConfig();
  }, [pageCode, frameId, passedConfig]);

  const propedChildren = React.Children.map(children, child => {
    return React.cloneElement(child, { ...rest, config, ref: configRef });
  });

  const renderText = () => {
    if (saving) {
      return <CircularProgress size={24} />;
    }
    if (typeof saved.success === 'boolean') {
      return saved.success ? <Check /> : <Close />;
    }
    return 'Save';
  };

  const disabled = saving || typeof saved.success === 'boolean';
  return (
    <div>
      {loaded && propedChildren}
      <Button onClick={handleSaveClick} variant="outlined" color="primary" disabled={disabled}>
        {renderText()}
      </Button>
    </div>
  );
};

WidgetConfig.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  pageCode: PropTypes.string.isRequired,
  frameId: PropTypes.string.isRequired,
  config: PropTypes.shape({
    code: PropTypes.string,
    config: PropTypes.shape({
      knowledgeSource: PropTypes.string,
    }),
  }),
};

WidgetConfig.defaultProps = {
  config: null,
};

export default WidgetConfig;
