import React from 'react';
import {
  View,
} from 'react-native';

import Utils from '../utils/utils';

export default class FocusListenerScreen extends React.Component {

  constructor(props) {
    super(props);

    let { addListener } = this.props.navigation;

    this.willFocusListener = addListener('willFocus', this._willFocus.bind(this));
    this.didFocusListener = addListener('didFocus', this._didFocus.bind(this));
    this.willBlurListener = addListener('willBlur', this._willBlur.bind(this));
    this.didBlurListener = addListener('didBlur', this._didBlur.bind(this));
  }

  componentWillUnmount() {
    this.willFocusListener.remove();
    this.didFocusListener.remove();
    this.willBlurListener.remove();
    this.didBlurListener.remove();
  }

  _willFocus() {
    if (Utils.isFunction(this.willFocus)) {
      this.willFocus();
    }
  }

  _didFocus() {
    if (Utils.isFunction(this.didFocus)) {
      this.didFocus();
    }
  }

  _willBlur() {
    if (Utils.isFunction(this.willBlur)) {
      this.willBlur();
    }
  }

  _didBlur() {
    if (Utils.isFunction(this.didBlur)) {
      this.didBlur();
    }
  }

  render() {
    return (
      <View />
    );
  }
}
