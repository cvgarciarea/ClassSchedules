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

  constructor(props) {
    super(props);

    this.state = {
      visibleDays: [
        consts.Days.MONDAY,
        consts.Days.TUESDAY,
        consts.Days.WEDNESDAY,
        consts.Days.THURSDAY,
        consts.Days.FRIDAY,
      ],

      visibleHours: {
        start: 8,
        end: 14,
      }
    }
  }

  render() {
    const cellsByRow = utils.getCellsByRow(this.state.visibleHours, this.state.visibleDays);

    let styles = StyleSheet.create({
      contentContainer: {
        height: (consts.Sizes.CellHeight + consts.Sizes.CellMargin * 2) * (this.state.visibleHours.end - this.state.visibleHours.start),
        width: (consts.Sizes.CellWidth + consts.Sizes.CellMargin * 2) * this.state.visibleDays.length,
      },
    });

    return (
      <ScrollView
        bounces={ true }
        bouncesZoom={ true }
        maximumZoomScale={ 1.5 }
        minimumZoomScale={ 0.75 }
        showsHorizontalScrollIndicator={ false }
        showsVerticalScrollIndicator={ false }
        contentContainerStyle={ styles.contentContainer }
        style={ constStyles.container }>

        <ScrollViewChild scrollDirection={ 'both' }>
          <GridContent cellsByRow={ cellsByRow } />
        </ScrollViewChild>

        <ScrollViewChild scrollDirection={ 'vertical' } style={ constStyles.rowLabelsContainer }>
          <RowLabels cellsByRow={ cellsByRow } />
        </ScrollViewChild>

        <ScrollViewChild scrollDirection={ 'horizontal' } style={ constStyles.columnLabelsContainer }>
          <ColumnLabels cellsByRow={ cellsByRow } />
        </ScrollViewChild>

      </ScrollView>
    );
  }
}

const constStyles = StyleSheet.create({
  container: {
    flex: 1,
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
