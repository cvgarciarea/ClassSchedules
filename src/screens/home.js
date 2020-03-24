import React from 'react';
import {
  View,
  Text,
  Modal,
  Easing,
  Animated,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

import i18n from '../i18n';
import Utils from '../utils/utils';
import State from '../utils/state';
import Colors from '../utils/colors';

import TimetablesScreen from './timetables';
import NotesScreen from './notes';
import GoalsScreen from './goals';
import SettingsScreen from './settings';

import HeaderButton from '../components/header-button';

export let animateFAB = null;
export let FABMode = null;

const BOTTOMBAR_HEIGHT = 52;

class SubButton extends React.Component {

  render() {
    let {
      left,
      top,
      opacity,
      iconName,
      color,
      size,
      onPress,
    } = this.props;

    return (
      <Animated.View
        style={{
          position: 'absolute',
          left,
          top,
          opacity,
        }}
      >

        <TouchableOpacity
          style={{
            elevation: 4,
            alignItems: 'center',
            justifyContent: 'center',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          }}
          onPress={ onPress }
        >
          <Icon
            name={ iconName }
            size={ 16 }
            color={ '#F8F8F8' }
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

class CreateButton extends React.Component {

  static defaultProps = {
    showSubButtons: false,
    onPress: null,
    onFirstButtonPress: null,
    onSecondButtonPress: null,
    onThirdButtonPress: null,
    onHideButtons: null,
  };

  static propTypes = {
    showSubButtons: PropTypes.bool,
    onPress: PropTypes.func,
    onFirstButtonPress: PropTypes.func,
    onSecondButtonPress: PropTypes.func,
    onThirdButtonPress: PropTypes.func,
    onHideButtons: PropTypes.func,
  };

  render() {
    // Todas las interpolaciones para los sub botones están fuertemente
    // inspiradas en el siguiente ejemplo:
    // https://itnext.io/react-native-tab-bar-is-customizable-c3c37dcf711f

    const size = 50;
    const subButtonSize = size * 0.75;
    const {
      width: screenWidth,
      height: screenHeight,
    } = Dimensions.get('window');

    const {
      animatedValue,
      showSubButtons,
      onPress,
      onFirstButtonPress,
      onSecondButtonPress,
      onThirdButtonPress,
    } = this.props;

    const startX = (screenWidth - subButtonSize) / 2;
    const startY = screenHeight -
                   BOTTOMBAR_HEIGHT -
                   StatusBar.currentHeight -
                   size / 2 +
                   subButtonSize / 2;

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
      // outputRange: [ -subButtonSize / 2, -60 - subButtonSize / 2 ],
      outputRange: [ startX, startX - 60 ],
    });

    const firstY = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      // outputRange: [ 0, -subButtonSize / 2 - 30 ],
      outputRange: [ startY, startY - 45 ],
    });

    const secondX = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ startX, startX ],
    });

    const secondY = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ startY, startY - 65 ],
    });

    const thirdX = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ startX, startX + 60 ],
    });

    const thirdY = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ startY, startY - 45 ],
    });

    const opacity = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ 0, 1 ], 
    });

    const overlayBackground = animatedValue.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ '#00000000', '#000000ab' ],
    });

    let renderPlusButton = styles => {
      return (
        <Animated.View
          iconName={ 'plus' }
          style={[
            {
              backgroundColor: mainBackgroundColor,
              width: size,
              height: size,
              borderRadius: size / 2,
              transform: [
                { rotate: mainRotate },
              ],
            },
            styles,
          ]}
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
      );
    }

    return (
      <View
        style={{
          flex: 4,
          alignItems: 'center',
        }}
      >

        {
          showSubButtons ?
            <Modal
              transparent={ true }
              onRequestClose={ this.props.onHideButtons }
            >
              <TouchableWithoutFeedback
                onPress={ this.props.onHideButtons }
              >

                <View
                  style={{
                    width: screenWidth,
                    height: screenHeight,
                  }}
                >

                  {
                    /**
                     * Un botón de más falso que solo se ve con el modal, da
                     * la impresión de que es el otro porque se encuentra en
                     * la misma posición.
                     */
                    renderPlusButton({
                      position: 'absolute',
                      left: (screenWidth - size) / 2,
                      bottom: 35,
                      zIndex: 100,
                    })
                  }

                  <Animated.View
                    style={{
                      backgroundColor: overlayBackground,
                      width: screenWidth,
                      height: screenHeight - BOTTOMBAR_HEIGHT - StatusBar.currentHeight,
                    }}
                  >
                    { /* Primer sub botón, horarios */ }
                    <SubButton
                      left={ firstX }
                      top={ firstY }
                      opacity={ opacity }
                      iconName={ 'calendar-multiselect' }
                      color={ Colors.timetables }
                      size={ subButtonSize }
                      onPress={ onFirstButtonPress }
                    />

                    { /* Segundo sub botón, notas */ }
                    <SubButton
                      left={ secondX }
                      top={ secondY }
                      opacity={ opacity }
                      iconName={ 'notebook' }
                      color={ Colors.notes }
                      size={ subButtonSize }
                      onPress={ onSecondButtonPress }
                    />

                    { /* Tercer sub botón, objetivos */ }
                    <SubButton
                      left={ thirdX }
                      top={ thirdY }
                      opacity={ opacity }
                      iconName={ 'trophy' }
                      color={ Colors.goals }
                      size={ subButtonSize }
                      onPress={ onThirdButtonPress }
                    />
                  </Animated.View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          :
            null
        }

        { /* El botón con el signo de más, que siempre está visible */ }

        {
          renderPlusButton({ 
            position: 'relative',
            bottom: 10,
            elevation: 4,
          })
        }

      </View>
    );
  }
}

class BottomTabBar extends React.Component {

  constructor(props) {
    super(props);

    FABMode = 'create';  // 'create' | 'cancel'

    this.state = {
      rendered: false,
      animatingFAB: false,
      FABMode,
    };

    this.FABModeAnimValue = new Animated.Value(0);
    animateFAB = this.animateFAB.bind(this);

    this.timetablesRoute = null;
  }

  componentDidMount() {
    State.subscribeTo(
      'theme',
      () => this.setState({ rendered: false }),
    );

    State.subscribeTo(
      'language',
      () => this.setState({ rendered: false }),
    );
  }

  animateFAB(mode) {
    // FIXME: El valor animado de los sub botones debería ser independiente
    //        del valor del botón del signo de más, por como funciona ahora
    //        cuando navego a otra pantalla los sub botones simplemente
    //        desaparecen, no hay animación de esconderse.

    if (mode === FABMode) {
      return;
    }

    FABMode = mode;
    let toValue = mode === 'create' ? 0 : 1;
    this.setState({ animatingFAB: true });

    Animated.timing(
      this.FABModeAnimValue,
      {
        toValue,
        easing: Easing.quad,
        duration: 250,
      },
    )
    .start(() => {
      this.setState({
        animatingFAB: false,
        FABMode: FABMode,
      });

      let callback = this.props.navigation.getParam('fabAnimationFinish', () => {});
      callback(FABMode);
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
          height: BOTTOMBAR_HEIGHT,
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
                  showSubButtons={
                    this.props.navigation.getParam('showSubButtons', false) &&
                    (this.state.FABMode === 'cancel' || this.state.animatingFAB)
                  }
                  onHideButtons={ () => this.animateFAB('create') }
                  onFirstButtonPress={ () => navigate('Timetables', { create: true }) }
                  onSecondButtonPress={ () => navigate('Notes', { create: true }) }
                  onThirdButtonPress={ () => navigate('Goals', { create: true }) }
                  onPress={ () => {
                    this.animateFAB(FABMode === 'create' ? 'cancel' : 'create');
      
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

  Notes: {
    screen: NotesScreen,
    navigationOptions: {
      tabBarLabel: i18n.t('notes'),
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
    <View
      style={{
        flexDirection: 'row',
      }}
    >
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

export let setOnFABAnimationFinish = callback => {
  setParams({ fabAnimationFinish: callback });
}

export let getCurrentFABMode = callback => {
  setParams({ getCurrentFABMode: callback });
}

export default tabNavigator;
