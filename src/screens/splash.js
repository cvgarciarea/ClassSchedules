import React from 'react';
import {
  View,
  UIManager,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import i18n from '../i18n';
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
    initFirebase(i18n);

    setTimeout(() => {
      Notifications.requestPermission();
      // Notifications.createReminder();
      // Notifications.buildDailyClassesNotifications();
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
