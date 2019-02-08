import React from 'react';
import {
  View,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Consts,  } from '../utils';

import Grid from "../components/Grid";

let consts = new Consts();

export default class TimetablesScreen extends React.Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={ consts.Colors.primaryDark }
          barStyle="light-content"
          hidden={ false } />

        <SafeAreaView style={{ flex: 1 }}>
          <Grid />
        </SafeAreaView>
      </View>
    );
  }
}