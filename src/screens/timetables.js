import React from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';
import ScrollView, { ScrollViewChild } from 'react-native-directed-scrollview';

import { Consts, Utils, Color } from '../utils';
import GridContent from '../components/GridContent';
import RowLabels from '../components/RowLabels';
import ColumnLabels from '../components/ColumnLabels';

let consts = new Consts();
let utils = new Utils();

export default class TimetablesScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      visibleDays: [
        // consts.Days.SUNDAY,
        consts.Days.MONDAY,
        consts.Days.TUESDAY,
        consts.Days.WEDNESDAY,
        consts.Days.THURSDAY,
        consts.Days.FRIDAY,
        // consts.Days.SATURDAY,
      ],

      visibleHours: {
        start: 8,
        end: 23,
      },

      data: {},

      /* debug */
      data: {
        "1": {
          "name": "Prueba",
          "color": '#aaffaa',
          "schedules": [
            {
              "startTime": "1 10:00",
              "endTime": "1 13:00",
              'color': '#ffaaaa',
            },
            {
              "startTime": "2 10:00",
              "endTime": "2 12:00",
              'color': '#aaffaa',
            },
            {
              "startTime": "2 09:15",
              "endTime": "2 10:45",
              'color': '#aaaaff',
            }
          ]
        }
      }
    }
  }

  itsVisible(datetime) {
    // Formato: 'D HH:mm'
    let day = Number(datetime.split(' ')[0]);
    let time = datetime.split(' ')[1];

    // TODO: Hay que comprobar basado en la hora también
    return this.state.visibleDays.includes(day);
  }

  renderClassesCells() {
    let firstHour = utils.numberToMomentHour(this.state.visibleHours.start);
    let lastHour = utils.numberToMomentHour(this.state.visibleHours.end);

    return Object.keys(this.state.data).map((key, i) => {
      return this.state.data[key].schedules.map((object, j) => {
        let dynamicStyles = {
          cell: {
            position: 'absolute',
            width: consts.Sizes.CellWidth + consts.Sizes.CellMargin,
            backgroundColor: this.state.data[key].color,
          },

          text: {
            fontSize: 20,
          }
        };

        if (!utils.emptyString(object.color)) {
          dynamicStyles.cell.backgroundColor = object.color;
        }

        dynamicStyles.text.color = Color.getTextColorForBackground(dynamicStyles.cell.backgroundColor);

        let startDate = Number(object.startTime.split(' ')[0]);
        let endDate = Number(object.endTime.split(' ')[0]);

        let startTime = object.startTime.split(' ')[1];
        let endTime = object.endTime.split(' ')[1];

        if (this.itsVisible(object.startTime) && this.itsVisible(object.endTime)) {
          // Tanto el inicio como el final son visibles

          let starts = moment(startTime, 'HH:mm');
          let ends = moment(endTime, 'HH:mm');
          let diff = ends.diff(starts, 'minutes');

          let betweenSurplus = diff / 60 * (consts.Sizes.CellMargin * 2);
          let beforeSurplus = starts.diff(firstHour, 'minutes') / 60 * ( consts.Sizes.CellMargin * 2)

          dynamicStyles.cell.top = consts.Sizes.CellHeight / 60 * starts.diff(firstHour, 'minutes') + beforeSurplus;
          dynamicStyles.cell.height = consts.Sizes.CellHeight / 60 * diff + betweenSurplus;
          dynamicStyles.cell.left = this.state.visibleDays.indexOf(startDate) * (consts.Sizes.CellWidth + 2 * consts.Sizes.CellMargin) + consts.Sizes.CellMargin / 2;

          let stylesheet = StyleSheet.create(dynamicStyles);

          return (
            <View key={ j } style={[ styles.cell, stylesheet.cell ]}>
              <Text style={ dynamicStyles.text }>{ this.state.data[key].name }</Text>
            </View>
          )
        } else if (this.itsVisible(object.startTime)) {
          // La hora de salida queda fuera
          console.log('CELL NO RENDERIZADA, CASO 1');
          return null;
        } else if (this.itsVisible(object.endTime)) {
          // La hora de inicio queda fuera
          console.log('CELL NO RENDERIZADA, CASO 2');
          return null;
        } else {
          // Esta clase no se ve
          return null;
        }
      });
    });
  }

  render() {
    const cellsByRow = utils.getCellsByRow(this.state.visibleHours, this.state.visibleDays);

    let dStyles = StyleSheet.create({
      contentContainer: {
        height: (consts.Sizes.CellHeight + consts.Sizes.CellMargin * 2) * (this.state.visibleHours.end - this.state.visibleHours.start),
        width: (consts.Sizes.CellWidth + consts.Sizes.CellMargin * 2) * this.state.visibleDays.length,
      },
    });

    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={ consts.Colors.primaryDark }
          barStyle="light-content"
          hidden={ false } />

        <SafeAreaView style={{ flex: 1 }}>
          { /* <Grid /> */ }
          { /* this.renderClassesCells() */ }

          <ScrollView
            bounces={ true }
            bouncesZoom={ true }
            maximumZoomScale={ 1.5 }
            minimumZoomScale={ 0.75 }
            showsHorizontalScrollIndicator={ false }
            showsVerticalScrollIndicator={ false }
            contentContainerStyle={ dStyles.contentContainer }
            style={ styles.container }>

            <ScrollViewChild scrollDirection={ 'both' }>
              <GridContent cellsByRow={ cellsByRow } />
            </ScrollViewChild>

            <ScrollViewChild scrollDirection={ 'both' } style={ styles.cellsContainer }>
              { this.renderClassesCells() }
              { /* <Text style={{ fontSize: 30 }}>TEST</Text> */ }
            </ScrollViewChild>

            <ScrollViewChild scrollDirection={ 'vertical' } style={ styles.rowLabelsContainer }>
              <RowLabels cellsByRow={ cellsByRow } />
            </ScrollViewChild>

            <ScrollViewChild scrollDirection={ 'horizontal' } style={ styles.columnLabelsContainer }>
              <ColumnLabels cellsByRow={ cellsByRow } />
            </ScrollViewChild>

          </ScrollView>

        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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

  cellsContainer: {
    position: 'absolute',
    top: 0,
    bottom: -consts.Sizes.CellHeight,
    left: 0,
    right: 0,
    // backgroundColor: '#aaffaa',
  },

  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
