// Source: https://github.com/lvlrSajjad/react-native-circle-reveal-view/blob/master/CircleTransition.js

import React, { Component } from 'react';
import {
  View,
  Animated,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';

import Utils from '../utils/utils';

export default class CircleTransition extends Component {

  static defaultProps = {
    backgroundColor: '#fff',
    duration: 250,
    expandedCallback: null,
    collapsedCallback: null,
  };

  static propTypes = {
    backgroundColor: PropTypes.string,
    duration: PropTypes.number,
    expandedCallback: PropTypes.func,
    collapsedCallback: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      showChildren: true,
      animating: false,
    };

    this.scale = new Animated.Value(0.00001);

    this.collapse = this.collapse.bind(this);
    this.expand = this.expand.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  getVisible() {
    return this.state.visible;
  }

  expand() {
    if (!this.state.animating) {
      this.setState({ visible: true, animating: true }, () => {
        if (!Utils.emptyValue(this.props.expandedCallback)) {
          this.props.expandedCallback();
        }

        Animated.timing(
          this.scale,
          {
            toValue: 5,
            duration: this.props.duration,
          }
        ).start(endResult => {
          if (endResult.finished) {
            this.setState({ animating: false });
          }
        });
      })
    }
  }

  collapse() {
    if (!this.state.animating) {
      if (!Utils.emptyValue(this.props.expandedCallback)) {
        this.props.collapsedCallback();
      }

      this.setState({ animating: true });

      Animated.timing(
        this.scale,
        {
          toValue: 0,
          duration: this.props.duration,
        }
      ).start(endResult => {
        if (endResult.finished) {
          this.setState({ visible: false, animating: false });
        }
      });
    }
  }

  toggle() {
    !this.state.visible ? this.expand() : this.collapse()
  }

  render() {
    let { width } = Dimensions.get('window');
    let opacity = this.scale.interpolate({
      inputRange: [ 4, 5 ],
      outputRange: [ 0, 1 ],
    });

    return (
      this.state.visible ?
        <View
          style={{
            ...this.props.style,
            overflow: 'hidden',
            width: '100%',
            height: '100%',
          }}
        >

          <Animated.View
            style={{
              position: 'absolute',
              backgroundColor: this.props.backgroundColor,
              bottom: -width / 2 + this.props.bottom,
              right: -width / 2 + this.props.right,
              width: width,
              height: width,
              borderRadius: width / 2,
              transform: [{
                scale: this.scale,
              }],
            }}
          />

          {
            this.state.showChildren ?
              <Animated.View
                style={{
                  opacity,
                  flex: 1,
                }}
              >

                { this.props.children }
              </Animated.View>
            :
              null
          }
        </View>
      :
        null
    );
  }
}
