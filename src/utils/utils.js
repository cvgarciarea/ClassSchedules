import moment from 'moment';

export default class Utils {

  static getCellsByRow(visibleHoursRange, visibleDays=[0, 1, 2, 3, 4, 5, 6]) {
    const cellsByRow = [];

    for (var rowIndex = visibleHoursRange.start; rowIndex <= visibleHoursRange.end; rowIndex++) {
      let row = {
        id: rowIndex,
        cells: [],
      }

      for (var columnIndex = 0; columnIndex < visibleDays.length; columnIndex++) {
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
}