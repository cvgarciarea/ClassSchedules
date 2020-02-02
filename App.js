import React from 'react';
import {
  YellowBox,
} from 'react-native';
import {
  createAppContainer,
  createStackNavigator,
} from 'react-navigation';

import Primitives from './src/utils/primitives';

import SplashScreen from './src/screens/splash';
import HomeScreen from './src/screens/home';
import EditClassScheduleScreen from './src/screens/edit-class-schedule';
import {
  BackupScreen,
  AboutScreen,
} from './src/screens/settings';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount',
  'Warning: componentWillReceiveProps',
]);

let App = createAppContainer(
  createStackNavigator({
    Splash: { screen: SplashScreen },
    Home: { screen: HomeScreen },
    EditClassSchedule: { screen: EditClassScheduleScreen },
    Backup: { screen: BackupScreen },
    About: { screen: AboutScreen },
  })
);

export default App;
