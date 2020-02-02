import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import i18n from '../../i18n';
import State from '../../utils/state';
import Colors from '../../utils/colors';

export default class BackupScreen extends React.Component {

  static navigationOptions() {
    const theme = Colors.Themes[State.theme];

    return {
      title: i18n.t('backup'),
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.foreground,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const theme = Colors.Themes[State.theme];

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      >
        <Text>BACKUP</Text>
      </View>
    );
  }
}
