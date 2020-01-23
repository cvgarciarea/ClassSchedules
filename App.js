import React from 'react';
import {
  YellowBox,
} from 'react-native';
import {
  createAppContainer,
  createStackNavigator,
} from 'react-navigation';

import i18n from './src/i18n';
import Primitives from './src/utils/primitives';

import SplashScreen from './src/screens/splash';
import HomeScreen from './src/screens/home';
import EditClassScheduleScreen from './src/screens/edit-class-schedule';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount',
  'Warning: componentWillReceiveProps',
]);

let App = createAppContainer(
  createStackNavigator({
    Splash: { screen: SplashScreen },
    Home: { screen: HomeScreen },
    EditClassSchedule: { screen: EditClassScheduleScreen },
  })
);

export default App;
