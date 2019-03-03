import React from 'react';
import {
  View,
  StatusBar,
} from 'react-native';

import Colors from '../utils/colors';

export default class SettingsScreen extends React.Component {

  render() {
    return (
      <View>
        <StatusBar
          backgroundColor={ Colors.primaryDark }
          barStyle="light-content"
          hidden={ false } />

      </View>
    );
  }
}