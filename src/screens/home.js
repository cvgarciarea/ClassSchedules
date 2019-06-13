import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import i18n from '../i18n';
import Utils from '../utils/utils';
import Colors from '../utils/colors';

import TimetablesScreen from './timetables';
import TestsScreen from './tests';
import SettingsScreen from './settings';

import HeaderButton from '../components/header-button';

let tabNavigator = createMaterialBottomTabNavigator({
  Timetables: {
    screen: TimetablesScreen,
    navigationOptions: {
      tabBarLabel: i18n.t('timetables'),
      tabBarColor: Colors.primary,
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          size={ 25 }
          name={ 'calendar-multiselect' }
          style={{ color: '#fff' }}
        />
      )
    },
  },

  Tests: {
    screen: TestsScreen,
    navigationOptions: {
      tabBarLabel: i18n.t('tests'),
      tabBarColor: Colors.tests,
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          size={ 25 }
          name={ 'pencil' }
          style={{ color: '#fff' }}
        />
      )
    }
  },

  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarLabel: i18n.t('settings'),
      tabBarColor: Colors.settings,
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          size={ 25 }
          name={ 'settings' }
          style={{ color: '#fff' }}
        />
      )
    }
  },
},
{
  activeTintColor: '#fff',
  shifting: true,
});

let _navigation = null;
tabNavigator.navigationOptions = ({ navigation }) => {
  _navigation = navigation;
  let showSaveButton = navigation.getParam('showSaveButton', false);
  console.log(showSaveButton);
  let headerRight = null;

  if (showSaveButton) {
    headerRight = (
      <HeaderButton
        iconName={ 'content-save' }
        onPress={ () => { console.log('SAVE') }}
      />
    )
  }

  return {
    headerStyle: {
      backgroundColor: Colors.primary,
    },
    headerRight,
  }
}

export let showSaveButton = show => {
  if (!Utils.emptyValue(_navigation)) {
    _navigation.setParams({
      showSaveButton: show
    });
  }
}

export default tabNavigator;
