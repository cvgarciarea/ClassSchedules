import React from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Utils from '../utils/utils';

import CompatibleTouchable from './compatible-touchable';

export class CustomHeaderButton extends React.Component {

  render() {

    return (
      <CompatibleTouchable
        onPress={ () => {
          if (!Utils.emptyValue(this.props.onPress)) {
            requestIdleCallback(() => {
              this.props.onPress();
            },
            {
              timeout: 250
            });
          }
        }}
      >

        <View
          style={{
            margin: 5,
            padding: 5,
            borderRadius: 40,
          }}
        >

          { this.props.children }
        </View>
      </CompatibleTouchable>
    );
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
