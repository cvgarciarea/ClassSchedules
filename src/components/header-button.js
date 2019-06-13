import React from 'react';
import {
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Utils from '../utils/utils';

export class CustomHeaderButton extends React.Component {

  render() {
    let ripple = null;
    if (Utils.itsRippleCompatibleDevice()) {
      ripple = TouchableNativeFeedback.Ripple('#000', true);
    }

    let onPress = () => {
      if (!Utils.emptyValue(this.props.onPress)) {
        requestIdleCallback(() => {
          this.props.onPress();
        },
        {
          timeout: 250
        });
      }
    }

    let touchableChild = (
      <View style={{ margin: 5, padding: 5, borderRadius: 40 }}>
        { this.props.children }
      </View>
    );

    if (Utils.itsTouchableNativeFeedbackCompatibleDevice()) {
      return (
        <TouchableNativeFeedback
          background={ ripple }
          onPress={ onPress }>

          { touchableChild }
    
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={ onPress }>

          { touchableChild }
        </TouchableOpacity>
      );
    }
  }
}

export default class HeaderButton extends CustomHeaderButton {

  static defaultProps = {
    color: '#fff',
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CustomHeaderButton onPress={ this.props.onPress }>
        <MaterialIcon
          name={ this.props.iconName }
          size={ 30 }
          color={ this.props.color }
        />
      </CustomHeaderButton>
    )
  }
}
