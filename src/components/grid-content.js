import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import Consts from '../utils/consts';
import Utils from '../utils/utils';
import State from '../utils/state';
import Colors from '../utils/colors';

export default class GridContent extends React.Component {

  static defaultProps = {
    cellsByRow: [],
  };

  static propTypes = {
    cellsByRow: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      updated: true,
    };

    State.subscribeTo(
      'theme',
      theme => {
        this.setState({ updated: false });
      },
    );

    State.subscribeTo(
      'create-schedule-at-empty-hour',
      val => {
        this.setState({ updated: false });
      },
    );
  } 

  render() {
    this.state.updated = true;
    let theme = Colors.Themes[State.theme];

    let { cellsByRow } = this.props;
    cellsByRow = cellsByRow || [];

    return (
      <View
        style={{
          backgroundColor: theme.gridBackground,
          paddingLeft: Consts.Sizes.rowLabelWidth,
          paddingTop: Consts.Sizes.columnLabelHeight,
        }}
      >

        {
          this.props.cellsByRow.map(row => {
            return this.renderRow(row);
          })
        }
      </View>
    );
  }

  renderRow(row) {
    return (
      <View
        key={ row.id }
        style={ styles.rowContainer }
      >
        {
          row.cells.map(cell => {
            return this.renderCell(row.id, cell);
          })
        }
      </View>
    );
  }

  renderCell(row, cell) {
    let theme = Colors.Themes[State.theme];

    return (
      <TouchableOpacity 
        key={ cell.id }
        style={[
          styles.cellContainer,
          { backgroundColor: theme.cellBackground }
        ]}
        disabled={ !State.createScheduleAtEmptyHour }
        onPress={ () => {
          const hour = Number(row);
          const day = Number(cell.id);

          Utils.secureCall(this.props.onCreateClassSchedule, day, hour);
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
  },

  cellContainer: {
    height: Consts.Sizes.CellHeight,
    width: Consts.Sizes.CellWidth,
    margin: Consts.Sizes.CellMargin,
  },
});
