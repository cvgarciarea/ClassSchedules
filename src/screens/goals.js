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
  enableSaveButton,
  setOnSaveButtonPress,
  setDeleteButtonVisible,
  setOnDeleteButtonPress,
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
    this.resetCreateGoal();
  }

  resetCreateGoal() {
    animateFAB('create');
    setSaveButtonVisible(false);
    setDeleteButtonVisible(false);
  }

  onFABPress() {
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
