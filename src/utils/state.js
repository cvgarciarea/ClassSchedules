import Consts from './consts';
import Utils from './utils';
import Storage from './storage';

export default class State {

  static theme = Consts.defaultSettings.theme;
  static visibleHours = Consts.defaultSettings.visibleHours;
  static visibleDays = Consts.defaultSettings.visibleDays;
  static recentColors = Consts.defaultSettings.recentColors;
  static createScheduleAtEmptyHour = Consts.defaultSettings.createScheduleAtEmptyHour;

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
    } = Storage.Keys;

    const defaultValues = {
      [visibleDaysKey]: JSON.stringify(Consts.defaultSettings.visibleDays),
      [visibleHoursKey]: JSON.stringify(Consts.defaultSettings.visibleHours),
      [themeKey]: Consts.defaultSettings.theme,
      [recentColorsKey]: JSON.stringify(Consts.defaultSettings.recentColors),
      [createScheduleAtEmptyHourKey]: String(Consts.defaultSettings.createScheduleAtEmptyHourKey),
    };

    let values = await Storage.getMultipleValues([
      visibleDaysKey,
      visibleHoursKey,
      themeKey,
      recentColorsKey,
      createScheduleAtEmptyHourKey,
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

    if (values[createScheduleAtEmptyHourKey] !== State.createScheduleAtEmptyHourKey)
      stateVars['create-schedule-at-empty-hour'] = values[createScheduleAtEmptyHourKey];

    // Establezco los valores leídos
    State.visibleDays = values[visibleDaysKey];
    State.visibleHours = values[visibleHoursKey];
    State.theme = values[themeKey];
    State.recentColors = values[recentColorsKey];
    State.createScheduleAtEmptyHour = values[createScheduleAtEmptyHourKey];

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
    Storage.storeValue(Storage.Keys.createScheduleAtEmptyHour, String(value));
    State._trigger('create-schedule-at-empty-hour', State.createScheduleAtEmptyHour);
  }
}