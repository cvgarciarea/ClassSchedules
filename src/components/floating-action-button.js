import React from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

import Colors from '../utils/colors';
import Utils from '../utils/utils';

/*
<Animated.View>

  <Animatable.View ref={ value => this.rotateView = value }>
    <Icon
      name={ 'plus' }
      size={ 30 }
      color={ '#fff' } />

  </Animatable.View>

</Animated.View>
*/
export default class FloatingActionButton extends React.Component {

  static defaultProps = {
    iconSize: 30,
    style: null,
    color: null,
  }

  constructor(props) {
    super(props);

    this._animatableView = null;
  }

  async animate(animation) {
    if (!Utils.emptyValue(this._animatableView)) {
      return await this._animatableView.animate(animation);
    }
  }

  render() {
    let ripple = null;
    if (Utils.itsRippleCompatibleDevice()) {
      ripple = TouchableNativeFeedback.Ripple('#000', true);
    }

    let backgroundColor = this.props.color;
    if (Utils.emptyValue(backgroundColor)) {
      backgroundColor = Colors.secondary;
    }

    return (
      <Animatable.View
        ref={ view => this._animatableView = view }
        style={[
          styles.floatingActionButton,
          { backgroundColor },
          this.props.style,
      ]}>

        <TouchableNativeFeedback
          background={ ripple }
          onPress={ this.props.onPress }>

          <View
            pointerEvents='box-only'
            style={ styles.floatingActionButtonChild }>

            {
              Utils.emptyValue(this.props.children) ?
                <Icon
                  name={ this.props.iconName }
                  size={ this.props.iconSize }
                  color={ '#fff' } />
              :
                this.props.children
            }

          </View>

        </TouchableNativeFeedback>
      </Animatable.View>
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