/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Consts from '../utils/consts';
import Colors from '../utils/colors';

export default class GridContent extends Component {

  static defaultProps = {
    cellsByRow: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      updated: true,
    }

    Colors.addThemeCallback(theme => { this.setState({ updated: false }) });
  } 

  render() {
    this.state.updated = true;
    let theme = Colors.Themes[Colors.THEME];

    return (
      <View style={{
        backgroundColor: theme.gridBackground,
        paddingLeft: Consts.Sizes.rowLabelWidth,
        paddingTop: Consts.Sizes.columnLabelHeight,
      }}>

        { this.props.cellsByRow.map(row => this._renderRow(row)) }
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
    let theme = Colors.Themes[Colors.THEME];

    return (
      <TouchableOpacity 
        key={ cell.id }
        style={[ styles.cellContainer, { backgroundColor: theme.cellBackground } ]}
        onPress={ () => { } }>

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
    height: Consts.Sizes.CellHeight,
    width: Consts.Sizes.CellWidth,
    margin: Consts.Sizes.CellMargin,
  },
});
