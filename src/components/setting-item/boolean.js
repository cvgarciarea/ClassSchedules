import React from 'react';

import SettingItem from './setting-item';
import Toggle from '../toggle';

export default class BooleanSettingItem extends SettingItem {

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      value: false,
    };
  }

  rightChild() {
    return (
      <Toggle
        active={ false }
        onToggle={ () => {} }
      />
    );
  }

  handlePress() {
    let newState = !this.state.value;
    this.setState({ value: newState });
  }
}
