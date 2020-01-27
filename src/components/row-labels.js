/* @flow */

import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Consts from '../utils/consts';
import Colors from '../utils/colors';

export default class RowLabels extends Component {

  renderRowLabel(row) {
    let hour = (row.id) + '';
    if (hour.length === 1) {
      hour = '0' + hour;
    }

    let time = hour + ':00';

    return (
      <View
        key={ row.id }
        style={ styles.rowLabel }
        pointerEvents={ 'none' }
      >

        <Text
          style={ styles.rowTitle }
        >
          { time }
        </Text>
      </View>
    );
  }

  render() {
    let { cellsByRow: rows } = this.props;
    rows = JSON.parse(JSON.stringify(rows));

    if (rows.length > 0) {
      rows.push({
        id: rows[rows.length - 1].id + 1,
      });
    }

    return (
      <View
        style={ styles.container }
        pointerEvents={ 'none' }
      >

        { rows.map(row => this.renderRowLabel(row)) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  rowLabel: {
    paddingTop: Consts.Sizes.columnLabelHeight - Consts.Sizes.rowLabelTitleWidth / 2,
    height: (Consts.Sizes.CellHeight + 2 * Consts.Sizes.CellMargin),
    // justifyContent: 'flex-end',
    alignItems: 'center',
    // width: Consts.Sizes.rowLabelWidth,
  },

  rowTitle: {
    height: Consts.Sizes.rowLabelTitleWidth,
    backgroundColor: Colors.hourBackground,
    paddingVertical: 4,
    paddingHorizontal: 10,
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});
