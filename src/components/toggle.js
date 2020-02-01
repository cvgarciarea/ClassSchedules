import React from 'react';
import {
  Easing,
  Animated,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import i18n from '../i18n';
import Utils from '../utils/utils';

// Inspirado en: https://jonsuh.com/blog/animated-toggle-react-native/
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const knobOffset = 22;

export default class Toggle extends React.Component {

  static defaultProps = {
    active: false,
    onToggle: null,
  };

  static propTypes = {
    active: PropTypes.bool,
    onToggle: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handlePress = this.handlePress.bind(this);
    this.animate = this.animate.bind(this);

    this.state = {
      active: this.props.active,
      animatedValue: new Animated.Value(this.props.active ? knobOffset : 0),

      // Guardo esta función para poder usarla en getDerivedStateFromProps
      animate: this.animate,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.active !== state.active) {
      state.animate(props.active);

      return {
        active: props.active,
      };
    }

    return null;
  }

  handlePress() {
    let newState = !this.state.active;

    this.setState(
      { active: newState },
      () => {
        Utils.secureCall(this.props.onToggle, this.state.active);
      }
    );

    this.animate(newState);
  }

  animate(value) {
    Animated.timing(
      this.state.animatedValue,
      {
        toValue: value ? knobOffset : 0,
        easing: Easing.elastic(0),
        duration: 500,
      }
    ).start();
  }

  render() {
    let backgroundColor = this.state.animatedValue.interpolate({
      inputRange: [ 0, knobOffset ],
      outputRange: [ 'gray', 'limegreen' ],
    });

    return (
      <AnimatedTouchableOpacity
        accessible={ true }
        accessibilityRole={ 'checkbox' }
        accessibilityLabel={ i18n.t('checkbox') }
        accessibilityState={{
          checked: this.state.active,
        }}
        activeOpacity={ 0.5 }
        style={{
          backgroundColor,
          width: 50,
          height: 28,
          borderRadius: 32,
          padding: 2,
        }}
        onPress={ this.handlePress }
      >

        <Animated.View
          style={{
            backgroundColor: '#fff',
            width: 24,
            height: 24,
            borderRadius: 32,
            transform: [
              { translateX: this.state.animatedValue }
            ],
          }}
        />
      </AnimatedTouchableOpacity>
    );
  }
}
