import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Utils from '../utils/utils';

export default class Field extends React.Component {

  static defaultProps = {
    iconName: null,
    placeholder: null,
    value: '',
    onChange: null,
  };

  render() {
    return (
      <View style={ styles.container }>
        {
          !Utils.emptyString(this.props.iconName) ?
            <Icon
              size={ 32 }
              name={ this.props.iconName }
              style={{ paddingRight: 15 }}
            />
          :
            <View style={{ width: 47, height: 1 }} />
        }

        <TextInput
          value={ this.props.value }
          style={ styles.textInput }
          placeholder={ this.props.placeholder }
          onChangeText={ text => {
            if (!Utils.emptyValue(this.props.onChange)) {
              this.props.onChange(text)
            }
          }}
        />
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    height: 64,
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#ffaaaa',
  },

  textInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 5,
    // backgroundColor: '#aaffaa',
  },
});