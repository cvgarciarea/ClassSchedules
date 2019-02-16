/* @flow */

import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { Consts } from '../utils';

let consts = new Consts();

export default class ColumnLabels extends Component {
  render() {
    return (
      <View style={styles.container} pointerEvents={'box-none'}>
        { this.props.cellsByRow[1].cells.map((cell) => this.renderColumnLabel(cell)) }
      </View>
    );
  }

  renderColumnLabel(cell) {
    let names = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    return (
      <View
        key={ cell.id }
        style={ styles.columnLabel }
        pointerEvents={ 'box-none' }>

        <Text style={styles.columnTitle}>
          { names[cell.id] }
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  columnLabel: {
    width: consts.Sizes.CellWidth + 2 * consts.Sizes.CellMargin,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnTitle: {
    backgroundColor: consts.Colors.dayNameBackground,
    paddingVertical: 4,
    paddingHorizontal: 10,
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});
