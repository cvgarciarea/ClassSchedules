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
  setOnFABPress,
  setSaveButtonVisible,
  setOnSaveButtonPress,
  setDeleteButtonVisible,
  setOnDeleteButtonPress,
} from './home';

export default class NotesScreen extends FocusListenerScreen {

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
    this.resetCreateReminder();

    this.props.navigation.setParams({ create: false });
  }

  resetCreateReminder() {
    let create = this.props.navigation.getParam('create', false);
    if (!create) {
      animateFAB('create');
    }

    setSaveButtonVisible(create);
    setDeleteButtonVisible(false);
    setOnSaveButtonPress(this.onSaveButtonPress);
    setOnDeleteButtonPress(this.onDeleteButtonPress);
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
          backgroundColor: theme.background,
          flex: 1,
        }}
      >

      </View>
    );
  }
}
