import React from 'react';
import {
  View,
  Text,
  Modal,
  Easing,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';

import Utils from '../utils/utils';
import State from '../utils/state';
import Colors from '../utils/colors';

export default class InputModal extends React.Component {

  static defaultProps = {
    title: null,
    onRequestClose: null,
  };

  static propTypes = {
    title: PropTypes.string,
    onRequestClose: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.visibleAnimVal = new Animated.Value(0);
  }

  componentDidMount() {
    this.appear();
  }

  appear() {
    Animated.timing(
      this.visibleAnimVal,
      {
        toValue: 1,
        easing: Easing.linear,
        duration: 100,
      },
    ).start();
  }

  disappear() {
    return new Promise(resolve => {
      Animated.timing(
        this.visibleAnimVal,
        {
          toValue: 0,
          easing: Easing.linear,
          duration: 100,
        },
      ).start(resolve);
    });
  }

  render() {
    let theme = Colors.Themes[State.theme];

    let backgroundColor = this.visibleAnimVal.interpolate({
      inputRange: [0, 1],
      outputRange: ['#00000000', '#0000003f'],
      extrapolate: 'clamp',
    });

    return (
      <Modal
        animationType={ 'none' }
        style={{
          width: '100%',
          height: '100%',
        }}
        transparent={ true }
        onRequestClose={ () => Utils.secureCall(this.props.onRequestClose) }
      >

        <TouchableWithoutFeedback
          onPress={ () => Utils.secureCall(this.props.onRequestClose) }
        >
          <Animated.View
            style={[
              styles.inputModalMain,
              { backgroundColor },
            ]}
          >

            <TouchableWithoutFeedback
              onPress={ () => {} }
            >
              <View
                style={[
                  styles.inputModalBox,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.foreground,
                  },
                ]}
              >
                <View
                  style={[
                    styles.inputModalHeader,
                    { backgroundColor: theme.background }
                  ]}
                >

                  <Text style={{ color: theme.foreground }}>
                    { this.props.title }
                  </Text>
                </View>

                <View
                  style={ styles.inputModalChildBox }
                >
                  { this.props.child }
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  inputModalBackground: {
    flex: 1,
    backgroundColor: '#0000003f',
  },

  inputModalMain: {
    flex: 1,
    flexDirection: 'column-reverse',
  },

  inputModalBox: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 2,
    borderRadius: 4,
  },

  inputModalHeader: {
    borderBottomWidth: 2,
    borderColor: '#000',
    // backgroundColor: '#ffaaaa',
    backgroundColor: '#fff',  // FIXME: depende del tema seleccionado
    padding: 5,
  },

  inputModalChildBox: {
    padding: 5,
  }
});
