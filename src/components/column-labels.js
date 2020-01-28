/* @flow */

import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import i18n from '../i18n';
import Consts from '../utils/consts';
import Colors from '../utils/colors';

export default class ColumnLabels extends Component {

  render() {
    let { cellsByRow } = this.props;

    return (
      <View
        style={ styles.container }
        pointerEvents={ 'box-none' }
      >

        {
          cellsByRow.length > 0 ?
            this.props.cellsByRow[0].cells.map((cell) => this.renderColumnLabel(cell))
          :
            null
        }
      </View>
    );
  }

  renderColumnLabel(cell) {
    let names = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    return (
      <View
        key={ cell.id }
        style={ styles.columnLabel }
        pointerEvents={ 'box-none' }>

        <Text style={styles.columnTitle}>
          { i18n.t(names[cell.id]) }
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
    paddingLeft: Consts.Sizes.rowLabelWidth,
    width: Consts.Sizes.CellWidth + 2 * Consts.Sizes.CellMargin,
    justifyContent: 'center',
    alignItems: 'center',
  },

  columnTitle: {
    backgroundColor: Colors.dayNameBackground,
    paddingVertical: 4,
    paddingHorizontal: 10,
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});
