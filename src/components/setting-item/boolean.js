import React from 'react';
import PropTypes from 'prop-types';

import Utils from '../../utils/utils';

import SettingItem from './setting-item';
import Toggle from '../toggle';

export default class BooleanSettingItem extends SettingItem {

  static defaultProps = {
    ...SettingItem.defaultProps,
    value: false,
    onToggle: null,
  };

  static propTypes = {
    ...SettingItem.propTypes,
    value: PropTypes.bool,
    onToggle: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      value: this.props.value || false,
    };
  }

  handlePress() {
    let newState = !this.state.value;
    this.setState({ value: newState });

    Utils.secureCall(this.props.onToggle, newState);
  }

  rightChild() {
    return (
      <Toggle
        active={ this.state.value }
        onToggle={ () => {
          this.handlePress();
        }}
      />
    );
  }
}
