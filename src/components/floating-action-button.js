import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../utils/colors';
import Utils from '../utils/utils';

import CompatibleTouchable from './compatible-touchable';

export default class FloatingActionButton extends React.Component {

  static defaultProps = {
    iconSize: 30,
    style: null,
    color: null,
  }

  render() {
    let backgroundColor = this.props.color;
    if (Utils.emptyValue(backgroundColor)) {
      backgroundColor = Colors.secondary;
    }

    return (
      <View
        style={[
          styles.floatingActionButton,
          { backgroundColor },
          this.props.style,
        ]}
      >

        <CompatibleTouchable
          onPress={ this.props.onPress }
        >

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

        </CompatibleTouchable>
      </View>
    );
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