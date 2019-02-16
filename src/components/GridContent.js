/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Consts } from '../utils';

let consts = new Consts();

export default class GridContent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cellsByRow: props.cellsByRow || [],
    }
  } 

  render() {
    return (
      <View>
        { this.state.cellsByRow.map(row => this._renderRow(row)) }
      </View>
    );
  }

  _renderRow(row) {
    return (
      <View key={row.id} style={styles.rowContainer}>
        { row.cells.map(cell => this._renderCell(cell)) }
      </View>
    );
  }

  _renderCell(cell) {
    return (
      <TouchableOpacity 
        key={cell.id}
        style={styles.cellContainer}
        onPress={() => { }} >
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
  },
  cellContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: consts.Sizes.CellHeight,
    width: consts.Sizes.CellWidth,
    margin: consts.Sizes.CellMargin,
    backgroundColor: consts.Colors.cellBackground,
  },
});
