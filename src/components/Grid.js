/* @flow */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import ScrollView, { ScrollViewChild } from 'react-native-directed-scrollview';

import { Consts, Utils } from '../utils';
import GridContent from './GridContent';
import RowLabels from './RowLabels';
import ColumnLabels from './ColumnLabels';

let consts = new Consts();
let utils = new Utils();

export default class Grid extends Component {
  render() {
    const cellsByRow = utils.getCellsByRow();

    return (
      <ScrollView
        bounces={true}
        bouncesZoom={true}
        maximumZoomScale={1.5}
        minimumZoomScale={0.75}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        style={styles.container} >

        <ScrollViewChild scrollDirection={'both'}>
          <GridContent cellsByRow={cellsByRow} />
        </ScrollViewChild>

        <ScrollViewChild scrollDirection={'vertical'} style={styles.rowLabelsContainer}>
          <RowLabels cellsByRow={cellsByRow} />
        </ScrollViewChild>

        <ScrollViewChild scrollDirection={'horizontal'} style={styles.columnLabelsContainer}>
          <ColumnLabels cellsByRow={cellsByRow} />
        </ScrollViewChild>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    height: (consts.Sizes.CellHeight + consts.Sizes.CellMargin * 2) * 10,
    width: (consts.Sizes.CellWidth + consts.Sizes.CellMargin * 2) * 7,  // (100 width + 10 padding) * 7 days
  },
  rowLabelsContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 100,
  },
  columnLabelsContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 30,
  },
});
