import React from 'react';
import {
  Text,
} from 'react-native';

import State from '../../utils/state';
import Colors from '../../utils/colors';

export default class SettingsSectionHeader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: props.title || '',
    }
  }

  render() {
    let theme = Colors.Themes[State.theme];

    return (
      <Text
        style={{
          padding: 10,
          color: theme.foreground,
          backgroundColor: theme.sectionHeaderBackground,
        }}
      >

        { this.state.title }
      </Text>
    );
  }
}
