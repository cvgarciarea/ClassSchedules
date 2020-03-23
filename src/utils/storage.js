import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import Utils from './utils';
import Consts from './consts';

export default class Storage {

  static Keys = {
    visibleDays: 'visibledays',
    visibleHours: 'visiblehours',
    theme: 'theme',
    schedules: 'schedules',
    notes: 'notes',
    recentColors: 'recentcolors',
    createScheduleAtEmptyHour: 'createscheduleatemptyhour',
    dailyClassesNotificationsIDs: 'dailyclassesnotificationsids',
    notificationIDs: 'notificationids',

    dailySubjectsNotifications: 'dailysubjectsnotifications',
    dailySubjectsNotificationTime: 'dailysubjectsnotificationtime',
  };

  // ****************************************************************
  // **                           STORE                            **
  // ****************************************************************

  static async storeValue(key, value) {
    try {
      if (typeof(value) === 'object') {
        value = JSON.stringify(value);
      } else {
        value = String(value);
      }

      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async storeMultipleValues(object) {
    let unSaved = [];
    let saved = null;

    for (key in object) {
      saved = await Storage.storeValue(key, object[key]);
      if (!saved) {
        unSaved.push(key);
      }
    }

    return unSaved;
  }

  /**
   * Por limitaciones de SQLite solo se pueden guardar valores con un peso
   * menor a 2mb, la idea de esta función es fragmentar value en chunks que
   * superen dicho limite.
   * 
   * Es posible que exista un valor guardado vajo la misma key (por ejemplo,
   * si se está actualizando el valor) y que este ocupe más chunks, así que
   * hay que borrarlos todos (no alcanza con reemplazar los existentes).
   */
  static async storeLargeValue(key, value) {
    await Storage.removeLargeValue(key);

    if (!Utils.emptyString(value)) {
      let chunks = value.match(/.{1,100000}/g);
      for (let i=0; i<chunks.length; i++) {
        await Storage.storeValue(key + i, chunks[i], true);
      }
    }
  }

  // ****************************************************************
  // **                           REMOVE                           **
  // ****************************************************************

  static async removeValue(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (exception) {
      return false;
    }
  }

  static async removeMultipleValues(keys) {
    await AsyncStorage.multiRemove(keys);
  }

  static async removeAllData(ignore=[]) {
    let values = await AsyncStorage.getAllKeys();

    for (let i=0; i<ignore.length; i++) {
      values = values.removeAll(ignore[i]);
    }

    return await Storage.removeMultipleValues(values);
  }

  static async removeLargeValue(starts) {
    let keys = await AsyncStorage.getAllKeys();

    for (let i=0; i<keys.length; i++) {
      if (keys[i].startsWith(starts)) {
        await Storage.removeValue(keys[i]);
      }
    }
  }

  // ****************************************************************
  // **                          RETRIEVE                          **
  // ****************************************************************

  static async getValue(key, defaultValue=null) {
    try {
      const value = await AsyncStorage.getItem(key);

      if (value === null) {
        return defaultValue;
      } else {
        return value;
      }
    } catch (error) {
      return defaultValue;
    }
  }

  static async getMultipleValues(array, defaultValues={}) {
    let data = {};

    for (let i=0; i<array.length; i++) {
      let key = array[i];
      data[key] = await Storage.getValue(key, defaultValue=defaultValues[key]);
    }

    return data;
  }

  /**
   * Esta función intenta sortear una limitación de la SQLite en Android
   * que impide guardar un valor mayor a 2mb por clave.
   */
  static async getLargeValue(key) {
    let keys = await AsyncStorage.getAllKeys();
    keys.sort((a, b) => {
      aStarts = a.startsWith(key);
      bStarts = b.startsWith(key);

      if (aStarts && !bStarts) {
        return -1;
      } else if (!aStarts && bStarts) {
        return 1;
      }

      return Number(a.replaceAll(key, '')) - Number(b.replaceAll(key, ''));
    });

    let raw = [];

    for (let i=0; i<keys.length; i++) {
      if (!keys[i].startsWith(key)) {
        // Llegué a una clave que no empieza con key
        // después de pasar por todas las claves que
        // empiezan por key, así que terminé
        break;
      }

      let idx = Number(keys[i].replaceAll(key, ''));
      await Storage.getValue(keys[i])
      .then(chunk => {
        raw[idx] = chunk;
      })
    }

    return raw.join('');
  }
}
