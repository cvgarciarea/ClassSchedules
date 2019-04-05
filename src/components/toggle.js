import React from "react"
import PropTypes from "prop-types"
import {
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native"

// Inspired on: https://jonsuh.com/blog/animated-toggle-react-native/
const knobOffset = 22

export default class Toggle extends React.Component {
  static propTypes = {
    active: PropTypes.bool,
    onToggle: PropTypes.func.isRequired,
  }

  static defaultProps = {
    active: false,
  }

  state = {
    active: this.props.active,
    animatedValue: new Animated.Value(this.props.active ? knobOffset : 0),
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.active !== this.props.active) {
    }
  }

  handlePress() {
    let newState = !this.state.active;

    this.setState(
      { active: newState },
      () => {
        // this.props.onToggle(this.state.active)
      }
    )

    Animated.timing(
      this.state.animatedValue,
      {
        toValue: newState ? knobOffset : 0,
        easing: Easing.elastic(0),
        duration: 500,
      }
    ).start()
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        style={{
          backgroundColor: this.state.active ? "limegreen" : "gray",
          width: 50,
          height: 28,
          borderRadius: 32,
          padding: 2,
        }}
        onPress={ () => this.handlePress() } >

        <Animated.View style={{
          backgroundColor: '#fff',
          width: 24,
          height: 24,
          borderRadius: 32,
          transform: [{
            translateX: this.state.animatedValue,
          }]
        }} />
      </TouchableOpacity>
    )
  }
}