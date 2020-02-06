import moment from 'moment';
import {
  Platform,
} from 'react-native';

import i18n from '../i18n';
import Consts from './consts';

export default class Utils {

  static getCellsByRow(visibleHoursRange, visibleDays=[0, 1, 2, 3, 4, 5, 6]) {
    const cellsByRow = [];

    for (let rowIndex=visibleHoursRange.start; rowIndex < visibleHoursRange.end; rowIndex++) {
      let row = {
        id: rowIndex,
        cells: [],
      }

      for (let columnIndex=0; columnIndex < visibleDays.length; columnIndex++) {
        row.cells.push({
          id: visibleDays[columnIndex],
        });
      }

      cellsByRow.push(row);
    }

    return cellsByRow;
  }

  static isDefined(value) {
    return value !== null && value !== undefined;
  }

  static emptyValue(value) {
    return [null, undefined].includes(value);
  }

  static emptyString(value) {
    return this.emptyValue(value) || value === '';
  }

  static isFunction(value) {
    return typeof value === 'function';
  }

  static isBoolean(value) {
    return typeof value === 'boolean';
  }

  /**
   * Recibe una posible función como primer elemento de arguments, en caso de
   * que efectivamente se trate de una función se llama y se pasan el resto de
   * parámetros como argumentos a esta y se devuelve lo que la función
   * devuelva, en caso de no tratarse de funa función no se hace nada.
   */
  static secureCall() {
    let func = arguments[0];

    if (Utils.isFunction(func)) {
      let params = [];

      for (let i=1; i<arguments.length; i++) {
        params.push(arguments[i]);
      }

      return func(...params);
    }
  }

  /**
   * Recibe un valor y se intenta interpretar como un booleano, si se trata de
   * un booleano se devuelve tal cual, si es una cadena se ve de que valga
   * 'false', 'true', '0' o '1', etc...
   * 
   * @param {Any} value 
   * 
   * @return {Boolean}
   */
  static parseBoolean(value) {
    if (Utils.emptyValue(value)) {
      return false;
    } else if (typeof(value) === 'boolean') {
      return value;
    } else if (typeof(value) === 'string') {
      if (value === 'true') {
        return true;
      } else if (value === 'false') {
        return false;
      } else if (['0', '1'].includes(value)) {
        return Boolean(Number(value));
      } else {
        return null;
      }
    } else if (typeof(value) === 'number') {
      return Boolean(value);
    }

    return null;
  }

  static numberToMomentHour(value) {
    let hour = String(value);
    if (hour.length === 1) {
      hour = '0' + hour;
    }

    return moment(hour, 'HH');
  }

  static itsRippleCompatibleDevice() {
    return Platform.OS !== 'android' || (Platform.OS === 'android' && Platform.Version >= 21);
  }

  static itsTouchableNativeFeedbackCompatibleDevice() {
    return (
      Platform.OS === 'android' &&
      Platform.Version >= 18  // FIXME: Sé que la 17 no funciona, pero
                              // no sé cuál es la primera que funciona
    );
  }

  /**
   * @return {String} (En teoría) un String único que sirve para nombrar
   *                   archivos sin tener coliciones de nombres. Los String
   *                   resultantes tienen la forma:
   *                   xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   */
  static uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static makeCellAccessibilityLabel(day, hour) {
    let dayName = i18n.t(Consts.dayNames[day]);
    let [ genericLocale ] = i18n.locale.split('-')

    if (genericLocale === 'en') {
      return `${ dayName} from ${ hour } o'clock to ${ hour + 1 } o'clock`;
    } else if (genericLocale === 'es') {
      return `${ dayName } de ${ hour } a ${ hour + 1 }`;
    }
  }
}
