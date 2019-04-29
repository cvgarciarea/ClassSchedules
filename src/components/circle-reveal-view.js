// Source: https://github.com/lvlrSajjad/react-native-circle-reveal-view/blob/master/CircleTransition.js

import React, { Component } from 'react'
import {
  View,
  Animated,
  Dimensions,
} from 'react-native'
import * as Animatable from 'react-native-animatable'

import Utils from '../utils/utils';

class CircleTransition extends Component {

  scale = new Animated.Value(0.00001)

  static defaultProps = {
    backgroundColor: '#fff',
    duration: 250,
  }

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      showChildren: true,
      animating: false,
    }

    this.collapse = this.collapse.bind(this);
    this.expand = this.expand.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  getVisible() {
    return this.state.visible;
  }

  render() {
    let { width } = Dimensions.get('window')

    return (
      this.state.visible ?
        <View
          style={{ ...this.props.style, overflow: 'hidden', width: '100%', height: '100%' }}>

          <Animated.View style={{
            position: 'absolute',
            backgroundColor: this.props.backgroundColor,
            bottom: -width / 2 + this.props.bottom,
            right: -width / 2 + this.props.right,
            width: width,
            height: width,
            borderRadius: width / 2,
            transform: [{
              scale: this.scale
            }]
          }} />
          {
            this.state.showChildren &&
            <Animatable.View ref={ref => { this.childContainer = ref }}
              style={{
                opacity: 0,
                width: '100%',
                height: '100%',
              }}>

              { this.props.children }
            </Animatable.View>
          }
        </View>
      :
        null
    )
  }

  expand() {
    if (!this.state.animating) {
      this.setState({ visible: true, animating: true }, () => {
        Animated.timing(
          this.scale, {
            useNativeDriver: true,
            fromValue: 0,
            toValue: 5,
            duration: this.props.duration,
          }
        ).start(e => {
          if (e.finished) {
            if (!Utils.emptyValue(this.childContainer) && !Utils.emptyValue(this.childContainer)) {
              this.childContainer.fadeIn(200).then(() => this.setState({ animating: false }));
            }
          }
        })
      })
    }
  }

  collapse() {
    if (!this.state.animating) {
      this.setState({ animating: true });
      if (!Utils.emptyValue(this.childContainer) && !Utils.emptyValue(this.childContainer)) {
        this.childContainer.fadeOut(200);
      }

      Animated.timing(
        this.scale, {
          useNativeDriver: true,
          toValue: 0,
          duration: this.props.duration,
        }
      ).start(e => {
        if (e.finished) {
          this.setState({ visible: false, animating: false });
        }
      })
    }
  }

  toggle() {
    !this.state.visible ? this.expand() : this.collapse()
  }
}

export default CircleTransition