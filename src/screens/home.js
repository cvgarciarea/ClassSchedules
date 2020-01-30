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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

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

class CreateButton extends React.Component {

  static defaultProps = {
    showSubButtons: false,
    onPress: null,
    onFirstButtonPress: null,
    onSecondButtonPress: null,
    onThirdbuttonPress: null,
  };

  static propTypes = {
    showSubButtons: PropTypes.bool,
    onPress: PropTypes.func,
    onFirstButtonPress: PropTypes.func,
    onSecondButtonPress: PropTypes.func,
    onThirdbuttonPress: PropTypes.func,
  };

  render() {
    // Todas las interpolaciones para los sub botones están fuertemente
    // inspiradas en el siguiente ejemplo:
    // https://itnext.io/react-native-tab-bar-is-customizable-c3c37dcf711f

    const size = 50;
    const subButtonSize = size * 0.75;

    const {
      animatedValue,
      showSubButtons,
      onPress,
      onFirstButtonPress,
      onSecondButtonPress,
      onThirdbuttonPress,
    } = this.props;

    const mainBackgroundColor = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ Colors.Action.CONSTRUCTIVE, Colors.Action.DESTRICTIVE ],
    });

    const mainRotate = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ '0deg', '135deg' ],
    });

    const firstX = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ -subButtonSize / 2, -60 - subButtonSize / 2 ],
    });

    const firstY = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ 0, -subButtonSize / 2 - 30 ],
    });

    const secondX = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ -subButtonSize / 2, -subButtonSize / 2 ],
    });

    const secondY = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ 0, -subButtonSize / 2 - 50 ],
    });

    const thirdX = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ -subButtonSize / 2, 60 - subButtonSize / 2 ],
    });

    const thirdY = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ 0, -subButtonSize / 2 - 30 ],
    });

    const opacity = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ 0, 1 ], 
    });

    // FIXME: Los sub botones no detectan toques (onPress nunca se triggerea)

    return (
      <View
        style={{
          flex: 4,
          alignItems: 'center',
        }}
      >

        {
          showSubButtons ?
            <View>
              { /* Primer sub botón */ }
              <Animated.View
                style={{
                  position: 'absolute',
                  left: firstX,
                  top: firstY,
                  opacity,
                }}
              >

                <TouchableOpacity
                  onPress={ onFirstButtonPress }
                  onFocus={ () => console.log('testing10') }
                  style={{
                    elevation: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: subButtonSize,
                    height: subButtonSize,
                    borderRadius: subButtonSize / 2,
                    backgroundColor: '#48A2F8'
                  }}
                >
                  <Icon
                    name={ 'calendar-multiselect' }
                    size={ 16 }
                    color={ '#F8F8F8' }
                  />
                </TouchableOpacity>
              </Animated.View>

              { /* Segundo sub botón */ }
              <Animated.View
                style={{
                  position: 'absolute',
                  left: secondX,
                  top: secondY,
                  opacity,
                }}
              >

                <TouchableOpacity
                  onPress={ onSecondButtonPress }
                  style={{
                    elevation: 4,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: subButtonSize,
                    height: subButtonSize,
                    borderRadius: subButtonSize / 2,
                    backgroundColor: '#48A2F8'
                  }}
                >
                  <Icon
                    name={ 'notebook' }
                    size={ 16 }
                    color={ '#F8F8F8' }
                  />
                </TouchableOpacity>
              </Animated.View>

              { /* Tercer sub botón */ }
              <Animated.View
                style={{
                  position: 'absolute',
                  left: thirdX,
                  top: thirdY,
                  opacity,
                }}
              >

                <TouchableOpacity
                  onPress={ onThirdbuttonPress }
                  style={{
                    elevation: 4,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: subButtonSize,
                    height: subButtonSize,
                    borderRadius: subButtonSize / 2,
                    backgroundColor: '#48A2F8'
                  }}
                >
                  <Icon
                    name={ 'trophy' }
                    size={ 16 }
                    color={ '#F8F8F8' }
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          :
            null
        }

        { /* El botón con el signo de más, que siempre está visible */ }
        <Animated.View
          iconName={ 'plus' }
          style={{
            position: 'relative',
            bottom: 10,
            right: 0,
            backgroundColor: mainBackgroundColor,
            width: size,
            height: size,
            borderRadius: size / 2,
            elevation: 4,
            transform: [
              { rotate: mainRotate },
            ],
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={ onPress }
          >

            <Icon
              size={ 25 }
              name={ 'plus' }
              color={ '#fff' }
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

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
    )
    .start(() => {
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

    return (
      <View
        style={{
          flexDirection: 'row',
          height: 52,
          backgroundColor: '#0096A6',
        }}
        removeClippedSubviews={ false }
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
              const { navigate } = this.props.navigation;

              return (
                <CreateButton
                  key={ 10 }
                  animatedValue={ this.FABModeAnimValue }
                  showSubButtons={ this.props.navigation.getParam('showSubButtons', false) }
                  onFirstButtonPress={ () => navigate('Timetables', { craete: true }) }
                  onSecondButtonPress={ () => navigate('Reminders', { craete: true }) }
                  onThirdButtonPress={ () => navigate('Goals', { craete: true }) }
                  onPress={ () => {
                    this.animateFAB(this.FABMode === 'create' ? 'cancel' : 'create');
      
                    let callback = navigation.getParam('onCreatePress', null);
                    Utils.secureCall(callback);
                  }}
                />
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

  const theme = Colors.Themes[State.theme];

  if (saveButtonVisible) {
    headerRightChildren.push(
      <HeaderButton
        key={ 'save' }
        iconName={ 'content-save' }
        color={ theme.foreground }
        onPress={ navigation.getParam('onSaveButtonPress', null) }
      />
    );
  }

  if (deleteButtonVisible) {
    headerRightChildren.push(
      <HeaderButton
        key={ 'delete' }
        iconName={ 'delete' }
        color={ theme.foreground }
        onPress={ navigation.getParam('onDeleteButtonPress', null) }
      />
    );
  }

  let headerRight = (
    <View>
      { headerRightChildren }
    </View>
  );

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

const setParams = params => {
  if (Utils.isDefined(_navigation)) {
    _navigation.setParams(params);
  }
}

export let setOnFABPress = callback => {
  setParams({ onCreatePress: callback });
}

export let setSaveButtonVisible = visible => {
  setParams({ saveButtonVisible: visible });
}

export let setOnSaveButtonPress = callback => {
  setParams({ onSaveButtonPress: callback });
}

export let setDeleteButtonVisible = visible => {
  setParams({ deleteButtonVisible: visible });
}

export let setOnDeleteButtonPress = callback => {
  setParams({ onDeleteButtonPress: callback });
}

export let setShowSubButtons = show => {
  setParams({ showSubButtons: show });
}

export default tabNavigator;
