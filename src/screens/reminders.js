import React from 'react';
import {
  View,
  StatusBar,
} from 'react-native';

import State from '../utils/state';
import Colors from '../utils/colors';

export default class RemindersScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      rendered: false,
    };
  }

  componentDidMount() {
    State.subscribeTo(
      'theme',
      () => this.setState({ rendered: false }),
    );
  }

  render() {
    this.state.rendered = true;

    const theme = Colors.Themes[State.theme];
    console.log(State.theme);

    return (
      <View
        style={{
          backgroundColor: theme.background,
          flex: 1,
        }}
      >
        {/*
        <StatusBar
          backgroundColor={ Colors.primaryDark }
          barStyle="light-content"
          hidden={ false }
        />
        */}

      </View>
    );
  }
}
