import React from 'react';
import {
  View,
  Text,
  ScrollView,
  LayoutAnimation,
  TimePickerAndroid,
} from 'react-native';

import i18n from '../../i18n';
import Utils from '../../utils/utils';
import Storage from '../../utils/storage';
import State from '../../utils/state';

import {
  TimeSettingItem,
  BooleanSettingItem,
  SettingsSectionHeader,
} from '../../components/setting-item';

export default class NotificationsScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dailySubjects: State.dailySubjectsNotifications,
      dailySubjectsTime: State.dailySubjectsNotificationTime,
    };

    this.onDailySubjectsChanged = this.onDailySubjectsChanged.bind(this);
    this.onDailySubjectsTimeChanged = this.onDailySubjectsTimeChanged.bind(this);
  }

  onDailySubjectsChanged(value) {
    State.setDailySubjectsNotifications(value);

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ dailySubjects: value });
  }

  onDailySubjectsTimeChanged(time) {
    State.setDailySubjectsNotificationTime(time);
    this.setState({ dailySubjectsTime: time });
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}
      >

        <SettingsSectionHeader
          title={ i18n.t('daily') }
        />

        <BooleanSettingItem
          title={ i18n.t('notify-me-daily-about-classes') }
          value={ this.state.dailySubjects }
          onToggle={ this.onDailySubjectsChanged }
        />

        <TimeSettingItem
          title={ i18n.t('daily-classes-notification-time') }
          time={ this.state.dailySubjectsTime }
          onChange={ this.onDailySubjectsTimeChanged }
          style={{
            overflow: 'hidden',
            height: this.state.dailySubjects ? null : 0,
          }}
        />

      </ScrollView>
    );
  }
}
