import Consts from './consts';
import Utils from './utils';
import Storage from './storage';
import { Notifications } from './firebase';

export default class State {

  static theme = Consts.defaultSettings.theme;
  static visibleHours = Consts.defaultSettings.visibleHours;
  static visibleDays = Consts.defaultSettings.visibleDays;
  static recentColors = Consts.defaultSettings.recentColors;
  static createScheduleAtEmptyHour = Consts.defaultSettings.createScheduleAtEmptyHour;

  static dailySubjectsNotifications = Consts.defaultSettings.dailySubjectsNotifications;
  static dailySubjectsNotificationTime = Consts.defaultSettings.dailySubjectsNotificationTime;

  static _SUBSCRIPTIONS = {};

  static _trigger(stateVar, value) {
    let callbacks = State._SUBSCRIPTIONS[stateVar] || [];

    for (callback of callbacks) {
      if (Utils.isFunction(callback)) {
        callback(value);
      }
    }
  }

  static subscribeTo(stateVar, callback) {
    if (!Utils.isDefined(State._SUBSCRIPTIONS[stateVar])) {
      State._SUBSCRIPTIONS[stateVar] = [];
    }

    State._SUBSCRIPTIONS[stateVar].push(callback);
  }

  static async loadFromStorage(triggerCallbacks=false) {
    // Leo los valores guardados
    let {
      visibleDays: visibleDaysKey,
      visibleHours: visibleHoursKey,
      theme: themeKey,
      recentColors: recentColorsKey,
      createScheduleAtEmptyHour: createScheduleAtEmptyHourKey,
      dailySubjectsNotifications: dailySubjectsNotificationsKey,
      dailySubjectsNotificationTime: dailySubjectsNotificationTimeKey,
    } = Storage.Keys;

    const defaultValues = {
      [visibleDaysKey]: JSON.stringify(Consts.defaultSettings.visibleDays),
      [visibleHoursKey]: JSON.stringify(Consts.defaultSettings.visibleHours),
      [themeKey]: Consts.defaultSettings.theme,
      [recentColorsKey]: JSON.stringify(Consts.defaultSettings.recentColors),
      [createScheduleAtEmptyHourKey]: String(Consts.defaultSettings.createScheduleAtEmptyHour),
      [dailySubjectsNotificationsKey]: String(Consts.defaultSettings.dailySubjectsNotifications),
      [dailySubjectsNotificationTimeKey]: String(Consts.defaultSettings.dailySubjectsNotificationTime),
    };

    let values = await Storage.getMultipleValues([
      visibleDaysKey,
      visibleHoursKey,
      themeKey,
      recentColorsKey,
      createScheduleAtEmptyHourKey,
      dailySubjectsNotificationsKey,
      dailySubjectsNotificationTimeKey,
    ], defaultValues);

    // Hago JSON.parse a los valores que lo necesitan
    const needsParse = [
      visibleDaysKey,
      visibleHoursKey,
      recentColorsKey,
    ];

    for (let i=0; i<needsParse.length; i++) {
      values[needsParse[i]] = JSON.parse(values[needsParse[i]]);
    }

    // Cambio de tipo a los valores booleanos
    const booleans = [
      createScheduleAtEmptyHourKey,
      dailySubjectsNotificationsKey,
    ];

    for (let i=0; i<booleans.length; i++) {
      values[booleans[i]] = Utils.parseBoolean(values[booleans[i]]) || false;
    }

    // Detecto cuáles valores cambiaron con respecto al estado actual
    let stateVars = {};

    if (values[visibleDaysKey] !== State.visibleDays)
      stateVars['visible-days'] = values[visibleDaysKey];

    if (values[visibleHoursKey] !== State.visibleHours)
      stateVars['visible-hours'] = values[visibleHoursKey];

    if (values[themeKey] !== State.theme)
      stateVars['theme'] = values[themeKey];

    if (values[recentColorsKey] !== State.recentColors)
      stateVars['recent-colors'] = values[recentColorsKey];

    if (values[createScheduleAtEmptyHourKey] !== State.createScheduleAtEmptyHour)
      stateVars['create-schedule-at-empty-hour'] = values[createScheduleAtEmptyHourKey];

    if (values[dailySubjectsNotificationsKey] !== State.dailySubjectsNotifications)
      stateVars['daily-subject-notifications'] = values[dailySubjectsNotificationsKey];

    if (values[dailySubjectsNotificationTimeKey] !== State.dailySubjectsNotificationTime)
      stateVars['daily-subject-notification-time'] = values[dailySubjectsNotificationTimeKey];

    // Establezco los valores leídos
    State.visibleDays = values[visibleDaysKey];
    State.visibleHours = values[visibleHoursKey];
    State.theme = values[themeKey];
    State.recentColors = values[recentColorsKey];
    State.createScheduleAtEmptyHour = values[createScheduleAtEmptyHourKey];
    State.dailySubjectsNotifications = values[dailySubjectsNotificationsKey];
    State.dailySubjectsNotificationTime = values[dailySubjectsNotificationTimeKey];

    // Llamo a las funciones que detectan los cambios de estao
    if (triggerCallbacks) {
      for (let stateVar of Object.keys(stateVars)) {
        State._trigger(stateVar, stateVars[stateVar]);
      }
    }
  }

  static setVisibleDays(days) {
    days = days.sort();
    State.visibleDays = days;
    Storage.storeValue(Storage.Keys.visibleDays, JSON.stringify(days));
    State._trigger('visible-days');
  }

  static setVisibleHours(hours) {
    State.visibleHours = hours;
    Storage.storeValue(Storage.Keys.visibleHours, JSON.stringify(hours));
    State._trigger('visible-hours');
  }

  static setTheme(theme) {
    State.theme = theme;
    Storage.storeValue(Storage.Keys.theme, theme);
    State._trigger('theme', State.theme)
  }

  static setRecentColors(colors) {
    State.recentColors = colors;
    Storage.storeValue(Storage.Keys.recentColors, JSON.stringify(colors));
    State._trigger('recent-colors', State.recentColors);
  }

  static setCreateScheduleAtEmptyHour(value) {
    State.createScheduleAtEmptyHour = value;
    Storage.storeValue(Storage.Keys.createScheduleAtEmptyHour, value);
    State._trigger('create-schedule-at-empty-hour', State.createScheduleAtEmptyHour);
  }

  static setDailySubjectsNotifications(value) {
    State.dailySubjectsNotifications = value;
    Storage.storeValue(Storage.Keys.dailySubjectsNotifications, value);
    State._trigger('daily-subject-notifications', State.dailySubjectsNotifications);

    if (State.dailySubjectsNotifications) {
      Notifications.buildDailyClassesNotifications();
    } else {
      Notifications.clearDailyClassesNotifications();
    }
  }

  static setDailySubjectsNotificationTime(time) {
    State.dailySubjectsNotificationTime = time;
    Storage.storeValue(Storage.Keys.dailySubjectsNotificationTime, time);
    State._trigger('daily-subject-notification-time', State.dailySubjectsNotificationTime);

    if (State.dailySubjectsNotifications) {
      Notifications.buildDailyClassesNotifications();
    }
  }
}
