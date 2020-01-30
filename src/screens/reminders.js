import React from 'react';
import {
  View,
  StatusBar,
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

export default class RemindersScreen extends FocusListenerScreen {

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
    setShowSubButtons(false);

    this.resetCreateReminder();
  }

  resetCreateReminder() {
    animateFAB('create');
    setOnSaveButtonPress(this.onSaveButtonPress);
    setOnDeleteButtonPress(this.onDeleteButtonPress);
    setSaveButtonVisible(false);
    setDeleteButtonVisible(false);
  }

  onFABPress() {
    console.log('reminders');
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
          backgroundColor: theme.background,
          flex: 1,
        }}
      >

      </View>
    );
  }
}
