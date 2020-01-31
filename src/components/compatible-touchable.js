import React from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';

import Utils from '../utils/utils';

export default class CompatibleTouchable extends React.Component {

  render() {
    let Touchable;
    let props = { ...this.props };

    if (Utils.itsTouchableNativeFeedbackCompatibleDevice()) {
      Touchable = TouchableNativeFeedback;

      if (props.itsRounded && Utils.itsRippleCompatibleDevice()) {
        props.background = TouchableNativeFeedback.Ripple('#000', true);
      }

    } else {
      Touchable = TouchableOpacity;
    }

    return (
      <Touchable
        {...props}
      />
    );
  }
}
