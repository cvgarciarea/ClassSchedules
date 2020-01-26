import React from 'react';
import {
  View,
} from 'react-native';
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
  const saveButtonVisible = navigation.getParam('saveButtonVisible', false);
  const deleteButtonVisible = navigation.getParam('deleteButtonVisible', false);

  let headerRightChildren = [];

  if (saveButtonVisible) {
    headerRightChildren.push(
      <HeaderButton
        key={ 'save' }
        iconName={ 'content-save' }
        onPress={ navigation.getParam('onSaveButtonPress', null) }
        disabled={ !navigation.getParam('enableSaveButton', false) }
      />
    );
  }

  if (deleteButtonVisible) {
    headerRightChildren.push(
      <HeaderButton
        key={ 'delete' }
        iconName={ 'delete' }
        onPress={ navigation.getParam('onDeleteButtonPress', null) }
      />
    );
  }

  let headerRight = (
    <View>
      { headerRightChildren }
    </View>
  )

  return {
    headerStyle: {
      backgroundColor: Colors.primary,
    },
    headerRight,
  };
}

export let setSaveButtonVisible = visible => {
  if (!Utils.emptyValue(_navigation)) {
    _navigation.setParams({
      saveButtonVisible: visible,
      enableSaveButton: false,
    });
  }
}

export let enableSaveButton = enable => {
  if (!Utils.emptyValue(_navigation)) {
    _navigation.setParams({
      enableSaveButton: enable,
    });
  }
}

export let setOnSaveButtonPress = callback => {
  if (Utils.isDefined(_navigation)) {
    _navigation.setParams({
      onSaveButtonPress: callback
    });
  }
}

export let setDeleteButtonVisible = visible => {
  if (!Utils.emptyValue(_navigation)) {
    _navigation.setParams({
      deleteButtonVisible: visible,
    });
  }
}

export let setOnDeleteButtonPress = callback => {
  if (Utils.isDefined(_navigation)) {
    _navigation.setParams({
      onDeleteButtonPress: callback,
    });
  }
}

export default tabNavigator;
