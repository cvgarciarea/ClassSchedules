import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';

import i18n from '../../i18n';
import State from '../../utils/state';
import Colors from '../../utils/colors';

import Hyperlink from '../../components/hyperlink';

class Paragraph extends React.Component {

  render() {
    const theme = Colors.Themes[State.theme];

    return (
      <Text
        {...this.props}
        style={[
          {
            color: theme.foreground,
          },
          this.props.style,
        ]}
      />
    );
  }
}

export default class AboutScreen extends React.Component {

  static navigationOptions() {
    const theme = Colors.Themes[State.theme];

    return {
      title: i18n.t('about'),
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.foreground,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  }

  render() {
    const theme = Colors.Themes[State.theme];

    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.background,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            height: 40,
          }}
        />

        <Paragraph
          style={{ paddingBottom: 15 }}
        >
          Copyright © 2020
        </Paragraph>

        <Paragraph
          style={{ paddingBottom: 15 }}
        >
          { i18n.t('created-by') } Cristian García
        </Paragraph>

        <Paragraph>
          { i18n.t('license-info') }
        </Paragraph>

        <Paragraph>
          { i18n.t('source-code-info') }
        </Paragraph>

        <Hyperlink
          url={ 'https://github.com/cristian99garcia/ClassSchedules' }
        />
      </ScrollView>
    );
  }
}