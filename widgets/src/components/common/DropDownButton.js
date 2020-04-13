import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

class DropDownButton extends React.Component {
  state = {
    open: false,
    selectedIndex: 0,
  };

  anchorRef = React.createRef();

  handleClick = () => {
    const { onClick, options } = this.props;
    const { selectedIndex } = this.state;

    onClick(options[selectedIndex]);
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = e => {
    if (this.anchorRef.current && this.anchorRef.current.contains(e.target)) {
      return;
    }

    this.setState({ open: false });
  };

  handleMenuItemClick = selectedIndex => {
    this.setState({ selectedIndex, open: false });
  };

  render() {
    const { selectedIndex, open } = this.state;
    const { options, disabled } = this.props;

    return (
      <>
        <ButtonGroup
          color="primary"
          ref={this.anchorRef}
          disableElevation
          disabled={disabled}
          variant="outlined"
        >
          <Button onClick={this.handleClick}>{options[selectedIndex]}</Button>
          <Button size="small" onClick={this.handleToggle}>
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper open={open} anchorEl={this.anchorRef.current} placement="bottom-end">
          <Paper>
            <ClickAwayListener onClickAway={this.handleClose}>
              <MenuList id="split-button-menu">
                {options.map((option, index) => (
                  <MenuItem
                    key={option}
                    selected={index === selectedIndex}
                    onClick={() => this.handleMenuItemClick(index)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </>
    );
  }
}

DropDownButton.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

DropDownButton.defaultProps = {
  options: [],
  onClick: () => {},
  disabled: false,
};

export default DropDownButton;
