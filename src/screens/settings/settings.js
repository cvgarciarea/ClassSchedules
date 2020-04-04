import React from 'react';
import {
  View,
  ScrollView,
} from 'react-native';

import i18n from '../../i18n';

import Consts from '../../utils/consts';
import State from '../../utils/state';
import Colors from '../../utils/colors';

import FocusListenerScreen from '../focus-listener';
import {
  FABMode,
  animateFAB,
  setOnFABPress,
  setShowSubButtons,
  setOnFABAnimationFinish,
} from '../home';

import {
  SettingItem,
  BooleanSettingItem,
  SelectionSettingItem,
  TimeRangeSettingItem,
  WeekdaysSettingItem,
  NestedScreenSettingItem,
  SettingsSectionHeader,
} from '../../components/setting-item';

export default class SettingsScreen extends FocusListenerScreen {

  constructor(props) {
    super(props);

    this.state = {
      theme: State.theme,
      modals: [],
      rendered: false,
    };

    this.addModal = this.addModal.bind(this);
    this.removeModal = this.removeModal.bind(this);
    this.onFABPress = this.onFABPress.bind(this);
  }

  componentDidMount() {
    const modifiers = [
      'language',
      'visible-days',
      'visible-hours',
    ];

    for (modifier of modifiers) {
      State.subscribeTo(
        modifier,
        () => {
          this.setState({ rendered: false });
        },
      );
    }
  }

  didFocus() {
    // Tengo que ver si se está reseteando la animación del botón del signo de
    // más porque sino aparecen los tres botones como cuando se toca por
    // segunda vez en esta pantalla, es decir, escondiéndose.

    if (FABMode === 'create') {
      setShowSubButtons(true);
    } else {
      let set = false;

      setOnFABAnimationFinish(mode => {
        if (!set && mode === 'create') {
          set = true;
          setShowSubButtons(true);
        }
      })
    }

    animateFAB('create');
    setOnFABPress(this.onFABPress);
  }

  willBlur() {
    // Por ahora esta es la única pantalla que va a usar esta función, así que
    // es más fácil/rápido si me deshago de esta función acá y no el didFocus
    // del resto de pantallas.
    setOnFABAnimationFinish(() => {});
    setShowSubButtons(false);
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

  onFABPress() {
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

  onCreateScheduleAtEmptyHoursChanged(value) {
    State.setCreateScheduleAtEmptyHour(value);
  }

  onLanguageChanged(language) {
    State.setLanguage(language);
  }

  render() {
    console.log('settings render');
    this.state.rendered = true;

    let themes = {
      'light': { title: i18n.t('theme-light') },
      'dark': { title: i18n.t('theme-dark') },
      'amoled': { title: i18n.t('theme-amoled') },
    };

    let languages = {};
    for (let abv in i18n.supportedLanguages) {
      languages[abv] = { title: i18n.supportedLanguages[abv] };
    }

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

          <BooleanSettingItem
            title={ i18n.t('create-schedule-at-empty-hour') }
            icon={ 'gesture-tap' }
            value={ State.createScheduleAtEmptyHour }
            onToggle={ val => this.onCreateScheduleAtEmptyHoursChanged(val) }
          />

          <NestedScreenSettingItem
            title={ i18n.t('notifications') }
            icon={ 'bell' }
            navigation={ this.props.navigation }
            screenName={ 'Notifications' }
          />

          <SelectionSettingItem
            title={ i18n.t('language') }
            icon={ 'translate' }
            modalTitle={ i18n.t('language') }
            options={ languages }
            selected={ State.language }
            onChange={ language => this.onLanguageChanged(language) }
            showUpModal={ this.addModal }
            closeModal={ this.removeModal }
          />

          <SettingsSectionHeader
            title={ i18n.t('section-app-info') }
          />

          <NestedScreenSettingItem
            title={ i18n.t('about') }
            icon={ 'information' }
            navigation={ this.props.navigation }
            screenName={ 'About' }
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
