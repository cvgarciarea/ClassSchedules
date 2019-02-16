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
}