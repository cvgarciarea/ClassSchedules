/* @flow */

import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Consts from '../utils/consts';
import Colors from '../utils/colors';

export default class RowLabels extends Component {
  render() {
    return (
      <View style={styles.container} pointerEvents={'box-none'}>
        { this.props.cellsByRow.map(row => this.renderRowLabel(row)) }
      </View>
    );
  }

  renderRowLabel(row) {
    let hour = (row.id) + '';
    if (hour.length === 1) {
      hour = '0' + hour;
    }

    let time = hour + ':00';

    return (
      <View key={row.id} style={styles.rowLabel} pointerEvents={'box-none'}>
        <Text style={styles.rowTitle}>{ time }</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  rowLabel: {
    height: (Consts.Sizes.CellHeight + 2 * Consts.Sizes.CellMargin),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  rowTitle: {
    backgroundColor: Colors.hourBackground,
    paddingVertical: 4,
    paddingHorizontal: 10,
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});
