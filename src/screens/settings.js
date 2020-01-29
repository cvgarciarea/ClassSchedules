import React from 'react';
import {
  View,
  ScrollView,
} from 'react-native';

import i18n from '../i18n';

import Consts from '../utils/consts';
import State from '../utils/state';
import Colors from '../utils/colors';

import {
  SettingItem,
  BooleanSettingItem,
  SelectionSettingItem,
  TimeRangeSettingItem,
  WeekdaysSettingItem,
  SettingsSectionHeader,
} from '../components/setting-item';

export default class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      theme: State.theme,
      modals: [],
      rendered: false,
    };

    this.addModal = this.addModal.bind(this);
    this.removeModal = this.removeModal.bind(this);
  }

  componentDidMount() {
    State.subscribeTo(
      'visible-days',
      () => {
        this.setState({ rendered: false });
      }
    );

    State.subscribeTo(
      'visible-hours',
      () => {
        this.setState({ rendered: false });
      }
    );
  }

  addModal(modal) {
    let modals = this.state.modals.slice();
    modals.push(modal);
    this.setState({ modals });

    return modal;
  }

  removeModal(modalNode, modalRef) {
    modalRef.disappear()
    .then(() => {
      this.setState({ modals: this.state.modals.remove(modalNode) });
    });
  }

  onThemeChanged(theme) {
    State.setTheme(theme);
    this.setState({ theme });
  }

  onVisibleHoursChanged(range) {
    State.setVisibleHours(range);
  }

  onVisibleDaysChanged(days) {
    State.setVisibleDays(days);
  }

  render() {
    this.state.rendered = true;

    let themes = {
      'light': { title: i18n.t('theme-light') },
      'dark': { title: i18n.t('theme-dark') },
      'amoled': { title: i18n.t('theme-amoled') },
    };

    let theme = Colors.Themes[this.state.theme];

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      >

        {
          this.state.modals.map(modal => {
            return modal;
          })
        }

        <ScrollView>
          <SettingsSectionHeader
            title={ i18n.t('section-general') }
          />

          <SelectionSettingItem
            title={ i18n.t('theme') }
            icon={ 'circle-slice-4' }
            modalTitle={ i18n.t('theme') }
            options={ themes }
            selected={ this.state.theme }
            onChange={ theme => this.onThemeChanged(theme) }
            showUpModal={ this.addModal }
            closeModal={ this.removeModal }
          />

          <TimeRangeSettingItem
            title={ i18n.t('visible-time-range') }
            icon={ 'clock' }
            startHour={ State.visibleHours.start }
            endHour={ State.visibleHours.end }
            touchable={ false }
            onChange={ ([ start, end ]) => {
              this.onVisibleHoursChanged({ start, end });
            }}
          />

          <WeekdaysSettingItem
            title={ i18n.t('visible-days' )}
            icon={ 'calendar-multiselect' }
            touchable={ false }
            activeDays={ State.visibleDays }
            onChange={ days => this.onVisibleDaysChanged(days) }
          />

          <SettingItem
            title={ i18n.t('notifications') }
            icon={ 'bell' }
          />

          <SettingsSectionHeader
            title={ i18n.t('section-app-info') }
          />

          <SettingItem
            title={ i18n.t('about') }
            icon={ 'information' }
            handlePress={ () => {
              this.props.navigation.navigate('About');
            }}
          />

          <SettingItem
            title={ `${ i18n.t('version') }: ${ Consts.APP_VERSION }` }
            icon={ 'developer-board' }
          />

        </ScrollView>
      </View>
    );
  }
}
