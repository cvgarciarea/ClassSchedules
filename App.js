require('./src/ignore-stupid-warnings');

import {
  YellowBox,
} from 'react-native';
import {
  createAppContainer,
  createStackNavigator,
} from 'react-navigation';

// Cargar funciones extras para los tipos de datos de JavaScript
require('./src/utils/primitives');

// Cargar pantallas y componentes
import SplashScreen from './src/screens/splash';
import HomeScreen from './src/screens/home';
import EditClassScheduleScreen from './src/screens/edit-class-schedule';
import {
  NotificationsScreen,
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
    Notifications: { screen: NotificationsScreen },
    Backup: { screen: BackupScreen },
    About: { screen: AboutScreen },
  })
);

export default App;
