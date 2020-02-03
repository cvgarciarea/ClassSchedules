import React from 'react';
import {
  View,
  UIManager,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import State from '../utils/state';
import initFirebase, { Notifications } from '../utils/firebase';

export default class SplashScreen extends React.Component {

  static navigationOptions() {
    return {
      header: null,
    };
  }

  constructor(props) {
    super(props);

    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  async componentDidMount() {
    initFirebase();

    setTimeout(() => {
      Notifications.requestPermission();
      // Notifications.createReminder();
    }, 500);

    State.loadFromStorage()
    .then(() => {
      this.props.navigation.reset([
        NavigationActions.navigate({
          routeName: 'Home',
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
