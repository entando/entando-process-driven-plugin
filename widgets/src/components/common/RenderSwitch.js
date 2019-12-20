import { FormGroup, ControlLabel, Switch, InputGroup } from 'patternfly-react';
import PropTypes from 'prop-types';
import React from 'react';

const RenderSwitch = ({ id, label, checked, onChange }) => (
  <FormGroup controlId={id}>
    <InputGroup>
      <Switch
        baseClass="bootstrap-switch"
        bsSize="normal"
        title="normal"
        value={checked}
        defaultValue={null}
        onChange={onChange}
      />
      <ControlLabel className="switch-label">{label}</ControlLabel>
    </InputGroup>
  </FormGroup>
);

RenderSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

RenderSwitch.defaultProps = {
  checked: true,
  onChange: () => {},
};

export default RenderSwitch;
