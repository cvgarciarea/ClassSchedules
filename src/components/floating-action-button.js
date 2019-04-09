import React from 'react';
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../utils/colors';
import Utils from '../utils/utils';

export default class FloatingActionButton extends React.Component {

  static defaultProps = {
    iconSize: 30,
  }

  render() {
    let ripple = null;
    if (Utils.itsRippleCompatibleDevice()) {
      ripple = TouchableNativeFeedback.Ripple('#000', true);
    }

    return (
      <View style={[
        styles.floatingActionButton,
        { backgroundColor: Colors.secondary }
      ]}>

        <TouchableNativeFeedback
          background={ ripple }
          onPress={ this.props.onPress }>

          <View
            pointerEvents='box-only'
            style={ styles.floatingActionButtonChild }>

            <Icon
              name={ this.props.iconName }
              size={ this.props.iconSize }
              color={ '#fff' } />

          </View>

        </TouchableNativeFeedback>
      </View>
    )
  }
}

const size = 50;

let styles = StyleSheet.create({
  floatingActionButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: size,
    height: size,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: size * 2,
    elevation: 4,
  },

  floatingActionButtonChild: {
    width: size,
    height: size,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: size * 2,
  },
})