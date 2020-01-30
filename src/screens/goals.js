import React from 'react';
import {
  View,
} from 'react-native';

import State from '../utils/state';
import Colors from '../utils/colors';

import FocusListenerScreen from './focus-listener';
import {
  animateFAB,
  animatingFAB,
  setOnFABPress,
  setSaveButtonVisible,
  setOnSaveButtonPress,
  setDeleteButtonVisible,
  setOnDeleteButtonPress,
  setShowSubButtons,
} from './home';

export default class GoalsScreen extends FocusListenerScreen {

  constructor(props) {
    super(props);

    this.state = {
      rendered: false,
    };

    this.onFABPress = this.onFABPress.bind(this);
    this.onSaveButtonPress = this.onSaveButtonPress.bind(this);
    this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
  }

  componentDidMount() {
    State.subscribeTo(
      'theme',
      () => this.setState({ rendered: false }),
    );
  }

  didFocus() {
    setOnFABPress(this.onFABPress);
    this.resetCreateGoal();
    setShowSubButtons(false);
  }

  resetCreateGoal() {
    animateFAB('create');
    setSaveButtonVisible(false);
    setDeleteButtonVisible(false);
  }

  onFABPress() {
    console.log('goals')
  }

  onSaveButtonPress() {
  }

  onDeleteButtonPress() {
  }

  render() {
    this.state.rendered = true;

    const theme = Colors.Themes[State.theme];

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      >
      </View>
    );
  }
}
