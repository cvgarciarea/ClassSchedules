import React from 'react';
import {
  View,
  StatusBar,
} from 'react-native';
import { Consts } from '../utils';

let consts = new Consts();

export default class TestsScreen extends React.Component {

  render() {
    return (
      <View>
        <StatusBar
          backgroundColor={ consts.Colors.primaryDark }
          barStyle="light-content"
          hidden={ false } />

      </View>
    );
  }
}