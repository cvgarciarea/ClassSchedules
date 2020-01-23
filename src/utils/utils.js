import moment from 'moment';
import {
  Platform,
} from 'react-native';

export default class Utils {

  static getCellsByRow(visibleHoursRange, visibleDays=[0, 1, 2, 3, 4, 5, 6]) {
    const cellsByRow = [];

    for (let rowIndex=visibleHoursRange.start; rowIndex <= visibleHoursRange.end; rowIndex++) {
      let row = {
        id: rowIndex,
        cells: [],
      }

      for (let columnIndex=0; columnIndex < visibleDays.length; columnIndex++) {
        row.cells.push({
          id: visibleDays[columnIndex],
          title: 'Cell',
        });
      }

      cellsByRow.push(row);
    }

    return cellsByRow;
  }

  static emptyValue(value) {
    return [null, undefined].includes(value);
  }

  static emptyString(value) {
    return this.emptyValue(value) || value === '';
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
}