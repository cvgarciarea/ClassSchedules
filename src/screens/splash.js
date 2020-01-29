import React from 'react';
import {
  View,
  UIManager,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import State from '../utils/state';
import Colors from '../utils/colors';

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
