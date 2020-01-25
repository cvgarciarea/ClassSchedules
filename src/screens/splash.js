import React from 'react';
import {
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import Consts from '../utils/consts';
import Storage from '../utils/storage';
import State from '../utils/state';

import WeekdaysPicker from '../components/weekdays-picker';

export default class SplashScreen extends React.Component {

  static navigationOptions() {
    return {
      header: null,
    };
  }

  async componentDidMount() {
    State.loadFromStorage()
    .then(() => {
      this.props.navigation.reset([
        NavigationActions.navigate({
          routeName: 'Home',
          params: {
            visibleDays: State.visibleDays,
            visibleHours: State.visibleHours,
          },
        })
      ], 0);  
    })
  }

  render() {
    return (
      <View />
    );
  }
}
