import React from 'react';
import {
  View,
  StatusBar,
} from 'react-native';

import Colors from '../utils/colors';

export default class TestsScreen extends React.Component {

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