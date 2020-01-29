import React from 'react';
import {
  View,
  Text,
  Easing,
  Animated,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
// import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import i18n from '../i18n';
import Utils from '../utils/utils';
import State from '../utils/state';
import Colors from '../utils/colors';

import TimetablesScreen from './timetables';
import RemindersScreen from './reminders';
import GoalsScreen from './goals';
import SettingsScreen from './settings';

import HeaderButton from '../components/header-button';

export let animateFAB = null;
export let animatingFAB = false;

class BottomTabBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      rendered: false,
    };

    this.FABModeAnimValue = new Animated.Value(0);
    this.FABMode = 'create';  // 'create' | 'cancel'
    animateFAB = this.animateFAB.bind(this);

    this.timetablesRoute = null;
  }

  componentDidMount() {
    State.subscribeTo(
      'theme',
      () => this.setState({ rendered: false }),
    );
  }

  animateFAB(mode) {
    if (mode === this.FABMode) {
      return;
    }

    this.FABMode = mode;
    let toValue = mode === 'create' ? 0 : 1;
    animatingFAB = true;

    Animated.timing(
      this.FABModeAnimValue,
      {
        toValue,
        easing: Easing.quad,
        duration: 250,
      },
    ).start(() => {
      animatingFAB = false;
    });
  }

  render() {
    this.state.rendered = true;

    const theme = Colors.Themes[State.theme];

    let {
      navigation,
      renderIcon,
      getLabelText,
      onTabPress,
      onTabLongPress,
      getAccessibilityLabel,
    } = this.props;

    let {
      routes,
      index,
    } = navigation.state;

    const activeTintColor = '#fff';
    const inactiveTintColor = '#ffffffab';

    let FABBackgroundColor = this.FABModeAnimValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ Colors.Action.CONSTRUCTIVE, Colors.Action.DESTRICTIVE ],
      extrapolate: 'clamp',
    });

    let FABRotateVal = this.FABModeAnimValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ '0deg', '135deg' ],
      extrapolate: 'clamp',
    });

    return (
      <View
        style={{
          flexDirection: 'row',
          height: 52,
          backgroundColor: '#0096A6',
        }}
      >

        <StatusBar
          backgroundColor={ theme.background }
          barStyle={ theme.statusBarStyle }
        />

        {
          routes.map((route, routeIndex) => {
            if (route.key === 'Timetables') {
              this.timetablesRoute = route;
            } else if (route.key === 'FAB') {
              const size = 50;

              return (
                <View
                  key={ 10 }
                  style={{ flex: 4, alignItems: 'center' }}
                >
                  <Animated.View
                    iconName={ 'plus' }
                    style={{
                      position: 'relative',
                      bottom: 10,
                      right: 0,
                      backgroundColor: FABBackgroundColor,
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                      elevation: 4,
                      transform: [
                        { rotate: FABRotateVal },
                      ],
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={ () => {
                        // onTabPress({ route: this.timetablesRoute });
                        this.animateFAB(this.FABMode === 'create' ? 'cancel' : 'create');

                        let callback = navigation.getParam('onCreatePress', null);
                        Utils.secureCall(callback);
                      }}
                    >

                      <Icon
                        size={ 25 }
                        name={ 'plus' }
                        style={{ color: '#fff' }}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              );
            }

            const isActive = index === routeIndex;
            const tintColor = isActive ? activeTintColor : inactiveTintColor;

            return (
              <TouchableOpacity
                key={ routeIndex }
                accessibilityLabel={ getAccessibilityLabel({ route }) }
                style={{
                  flex: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={ () => {
                  onTabPress({ route });
                  navigation.setParams({
                    screenName: getLabelText({ route }),
                  });
                }}
                onLongPress={ () => {
                  onTabLongPress({ route });
                  navigation.setParams({
                    screenName: getLabelText({ route }),
                  });
                }}
              >

                { renderIcon({ route, focused: isActive, tintColor }) }

                <Text
                  style={{
                    color: tintColor,
                    fontSize: 12,
                  }}
                >
                  { getLabelText({ route }) }
                </Text>

              </TouchableOpacity>
            );
          })
        }
      </View>
    );
  }
}

let tabNavigator = createBottomTabNavigator({
  Timetables: {
    screen: TimetablesScreen,
    navigationOptions: {
      tabBarLabel: i18n.t('timetables'),
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          size={ 25 }
          name={ 'calendar-multiselect' }
          style={{ color: tintColor }}
        />
      ),
    },
  },

  Reminders: {
    screen: RemindersScreen,
    navigationOptions: {
      tabBarLabel: i18n.t('reminders'),
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          size={ 25 }
          name={ 'notebook' }
          style={{ color: tintColor }}
        />
      ),
    },
  },

  FAB: {
    screen: View,
  },

  Goals: {
    screen: GoalsScreen,
    navigationOptions: {
      tabBarLabel: i18n.t('goals'),
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          size={ 25 }
          name={ 'trophy' }
          style={{ color: tintColor }}
        />
      ),
    },
  },

  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarLabel: i18n.t('more'),
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          size={ 25 }
          name={ 'dots-horizontal' }
          style={{ color: tintColor }}
        />
      )
    }
  },
},
{
  activeTintColor: '#fff',
  tabBarComponent: BottomTabBar,
});

let _navigation = null;
tabNavigator.navigationOptions = ({ navigation }) => {
  const title = navigation.getParam('screenName', i18n.t('timetables'));

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
  );

  const theme = Colors.Themes[State.theme];

  return {
    title,
    headerTintColor: theme.foreground,
    headerStyle: {
      backgroundColor: theme.background,
    },
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight,
  };
}

State.subscribeTo(
  'theme',
  theme => {
    if (Utils.isDefined(_navigation)) {
      _navigation.setParams({
        theme,
      });
    }
  }
)

export let setOnFABPress = callback => {
  if (Utils.isDefined(_navigation)) {
    _navigation.setParams({
      onCreatePress: callback,
    });
  }
}

export let setSaveButtonVisible = visible => {
  if (Utils.isDefined(_navigation)) {
    _navigation.setParams({
      saveButtonVisible: visible,
      enableSaveButton: false,
    });
  }
}

export let enableSaveButton = enable => {
  if (Utils.isDefined(_navigation)) {
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
  if (Utils.isDefined(_navigation)) {
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
