import moment from 'moment';

export class Color {

  static primary = '#ff5722'
  static primaryDark = '#c41C00'
  static primaryLight = '#ffC3b7'

  static secondary = '#8bc34a'
  static secondaryDark = '#5a9216'
  static secondaryLight = '#5a9216'

  static tests = '#7cb342'
  static testsDark = '#4b830d'
  static testsLight = '#aee571'

  static settings = '#1976d2'
  static settingsDark = '#004ba0'
  static settingsLight = '#63a4ff'

  static dayNameBackground = '#4b830d'
  static cellBackground = '#dadada'
  static hourBackground = '#004ba0'

  static hexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }

  static getTextColorForBackground(color) {
    if (typeof(color) === 'string') {
      color = this.hexToRGB(color);
    }

    let light = color.r * 0.299 + color.g * 0.587 + color.b * 0.114 > 186;
    return light ? '#000' : '#fff';
  }
}

export class Consts {

  Colors = {
    primary: '#ff5722',
    primaryDark: '#c41C00',
    primaryLight: '#ffC3b7',

    secondary: '#8bc34a',
    secondaryDark: '#5a9216',
    secondaryLight: '#5a9216',

    tests: '#7cb342',
    testsDark: '#4b830d',
    testsLight: '#aee571',

    settings: '#1976d2',
    settingsDark: '#004ba0',
    settingsLight: '#63a4ff',

    dayNameBackground: '#4b830d',
    cellBackground: '#dadada',
    hourBackground: '#004ba0',
  }

  Sizes = {
    CellWidth: 150,
    CellHeight: 80,
    CellMargin: 0.5,
  }

  Days = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  }
}

export class Utils {

  getCellsByRow(visibleHoursRange, visibleDays=[0, 1, 2, 3, 4, 5, 6]) {
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

  emptyValue(value) {
    return [null, undefined].includes(value);
  }

  emptyString(value) {
    return this.emptyValue(value) || value === '';
  }

  numberToMomentHour(value) {
    let hour = String(value);
    if (hour.length === 1) {
      hour = '0' + hour;
    }

    return moment(hour, 'HH');
  }
}