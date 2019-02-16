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
}

export class Utils {

  getCellsByRow() {
    const cellsByRow = [];

    for (var rowIndex = 1; rowIndex < 14; rowIndex++) {
      let row = {
        id: rowIndex,
        cells: [],
      }

      for (var columnIndex = 1; columnIndex < 8; columnIndex++) {
        row.cells.push({
          id: `${rowIndex}-${columnIndex}`,
          title: 'Cell',
        });
      }

      cellsByRow.push(row);
    }

    return cellsByRow;
  }
}