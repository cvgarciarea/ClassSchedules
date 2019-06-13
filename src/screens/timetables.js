import React from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';
import ScrollView, { ScrollViewChild } from 'react-native-directed-scrollview';

import i18n from '../i18n';

import Consts from '../utils/consts';
import Colors from '../utils/colors';
import Utils from '../utils/utils';

import GridContent from '../components/grid-content';
import RowLabels from '../components/row-labels';
import ColumnLabels from '../components/column-labels';
import FloatingActionButton from '../components/floating-action-button';
import CircleTransition from '../components/circle-reveal-view';
import CreateClassSchedule from '../components/create-class-schedule';
import { showSaveButton } from './home';

const FABAnimations = {
  rotate: {
    0: {
      rotate: '0deg',
      backgroundColor: Colors.Action.CONSTRUCTIVE,
    },
    1: {
      rotate: '135deg',
      backgroundColor: Colors.Action.DESTRICTIVE,
    }
  },

  reset_rotate: {
    0: {
      rotate: '135deg',
      backgroundColor: Colors.Action.DESTRICTIVE,
    },
    1: {
      rotate: '0deg',
      backgroundColor: Colors.Action.CONSTRUCTIVE,
    },
  }
}

const FABAnimationType = {
  ROTATE: 'rotate',
  RESET_ROTATE: 'reset_rotate',
}

export default class TimetablesScreen extends React.Component {

  constructor(props) {
    super(props);

    this.revealer = null;
    this.createScheduleFAB = null;
    this.fabAnimation = FABAnimationType.RESET_ROTATE;
    this.animatingFAB = false;

    this.state = {
      updated: true,

      visibleDays: [
        // consts.Days.SUNDAY,
        Consts.Days.MONDAY,
        Consts.Days.TUESDAY,
        Consts.Days.WEDNESDAY,
        Consts.Days.THURSDAY,
        Consts.Days.FRIDAY,
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

    Colors.addThemeCallback(theme => this.setState({ updated: false }));

    this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);

    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.resetCreateSchedule();
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    });

    this.didBlurListener = this.props.navigation.addListener('didBlur', () => {
      this.resetCreateSchedule();
    })
  }

  componentDidMount() {
    this.willBlurListener = this.props.navigation.addListener('willBlur', () =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  componentWillUnmount() {
    this.removeTimeout();
    this.focusListener.remove();
    this.willBlurListener.remove();
    this.didBlurListener.remove();
  }

  resetCreateSchedule() {
    let revealed = !Utils.emptyValue(this.revealer) && this.revealer.getVisible();
    let rotated = !Utils.emptyValue(this.createScheduleFAB) && this.fabAnimation === FABAnimationType.ROTATE;

    if (!this.animatingFAB) {
      if (revealed) {
        this.revealer.collapse();
      }

      if (rotated) {
        this.fabAnimation = FABAnimationType.RESET_ROTATE;
        this.createScheduleFAB.animate(FABAnimations[this.fabAnimation]);
      }
    }

    return revealed || rotated;
  }

  onBackButtonPressAndroid() {
    return this.resetCreateSchedule() || this.animatingFAB;
  }

  itsVisible(datetime) {
    // Formato: 'D HH:mm'
    let day = Number(datetime.split(' ')[0]);
    let time = datetime.split(' ')[1];

    // TODO: Hay que comprobar basado en la hora también
    return this.state.visibleDays.includes(day);
  }

  renderClassesCells() {
    let firstHour = Utils.numberToMomentHour(this.state.visibleHours.start);
    let lastHour = Utils.numberToMomentHour(this.state.visibleHours.end);

    return Object.keys(this.state.data).map((key, i) => {
      return this.state.data[key].schedules.map((object, j) => {
        let dynamicStyles = {
          cell: {
            position: 'absolute',
            width: Consts.Sizes.CellWidth + Consts.Sizes.CellMargin,
            backgroundColor: this.state.data[key].color,
          },

          text: {
            fontSize: 20,
          }
        };

        if (!Utils.emptyString(object.color)) {
          dynamicStyles.cell.backgroundColor = object.color;
        }

        dynamicStyles.text.color = Colors.getTextColorForBackground(dynamicStyles.cell.backgroundColor);

        let startDate = Number(object.startTime.split(' ')[0]);
        let endDate = Number(object.endTime.split(' ')[0]);

        let startTime = object.startTime.split(' ')[1];
        let endTime = object.endTime.split(' ')[1];

        if (this.itsVisible(object.startTime) && this.itsVisible(object.endTime)) {
          // Tanto el inicio como el final son visibles

          let starts = moment(startTime, 'HH:mm');
          let ends = moment(endTime, 'HH:mm');
          let diff = ends.diff(starts, 'minutes');

          let betweenSurplus = diff / 60 * (Consts.Sizes.CellMargin * 2);
          let beforeSurplus = starts.diff(firstHour, 'minutes') / 60 * ( Consts.Sizes.CellMargin * 2)

          dynamicStyles.cell.top = Consts.Sizes.CellHeight / 60 * starts.diff(firstHour, 'minutes') + beforeSurplus + Consts.Sizes.columnLabelHeight;
          dynamicStyles.cell.height = Consts.Sizes.CellHeight / 60 * diff + betweenSurplus;
          dynamicStyles.cell.left = this.state.visibleDays.indexOf(startDate) * (Consts.Sizes.CellWidth + 2 * Consts.Sizes.CellMargin) + Consts.Sizes.CellMargin / 2 + Consts.Sizes.rowLabelWidth;

          let stylesheet = StyleSheet.create(dynamicStyles);

          return (
            <View key={ j } style={[ styles.cell, stylesheet.cell ]}>
              <Text style={ dynamicStyles.text }>
                { this.state.data[key].name }
              </Text>
            </View>
          );
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
    this.state.updated = true;

    const theme = Colors.Themes[Colors.THEME];
    const cellsByRow = Utils.getCellsByRow(this.state.visibleHours, this.state.visibleDays);

    let dStyles = StyleSheet.create({
      contentContainer: {
        height: (Consts.Sizes.CellHeight + Consts.Sizes.CellMargin * 2) * (this.state.visibleHours.end - this.state.visibleHours.start) + Consts.Sizes.columnLabelHeight,
        width: (Consts.Sizes.CellWidth + Consts.Sizes.CellMargin * 2) * this.state.visibleDays.length + Consts.Sizes.rowLabelWidth,
      },
    });

    return (
      <View style={{ flex: 1, backgroundColor: theme.gridBackground }}>
        <StatusBar
          backgroundColor={ Colors.primaryDark }
          barStyle="light-content"
          hidden={ false } />

        <SafeAreaView style={{ flex: 1 }}>
          { /* <Grid /> */ }
          { /* this.renderClassesCells() */ }

          <ScrollView
            bounces={ true }
            bouncesZoom={ true }
            maximumZoomScale={ 2 }
            minimumZoomScale={ 0.2 }
            showsHorizontalScrollIndicator={ false }
            showsVerticalScrollIndicator={ false }
            contentContainerStyle={ dStyles.contentContainer }
            style={ styles.container }>

            <ScrollViewChild scrollDirection={ 'both' }>
              <GridContent cellsByRow={ cellsByRow } />
            </ScrollViewChild>

            <ScrollViewChild scrollDirection={ 'both' } style={[ styles.cellsContainer, ]}>
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

        <CircleTransition
          ref={ ref => this.revealer = ref }
          expandedCallback={ () => { showSaveButton(true) }}
          collapsedCallback={ () => { showSaveButton(false) }}
          bottom={ 41 /* 16 de margen + 50 / 2 de tamaño */ }
          right={ 41 /* 16 de margen + 50 / 2 de tamaño */ }>

          <CreateClassSchedule />

        </CircleTransition>

        <FloatingActionButton
          iconName={ 'plus' }
          ref={ fab => this.createScheduleFAB = fab }
          onPress={ () => {
            if (!Utils.emptyValue(this.revealer)) {
              this.revealer.toggle();
            }

            if (!Utils.emptyValue(this.createScheduleFAB)) {
              let animation;
              if (this.fabAnimation === FABAnimationType.RESET_ROTATE) {
                animation = FABAnimationType.ROTATE;
              } else {
                animation = FABAnimationType.RESET_ROTATE;
              }

              this.animatingFAB = true;
              this.createScheduleFAB.animate(FABAnimations[animation])
              .then(() => {
                this.fabAnimation = animation;
                this.animatingFAB = false;
              });  
            }
        }}>

        </FloatingActionButton>

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
    height: Consts.Sizes.columnLabelHeight,
  },

  cellsContainer: {
    position: 'absolute',
    top: 0,
    bottom: -Consts.Sizes.CellHeight,
    left: 0,
    right: 0,
    // backgroundColor: '#aaffaa',
  },

  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
