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
import Utils from '../utils/utils';
import Storage from '../utils/storage';
import State from '../utils/state';
import Colors from '../utils/colors';

import GridContent from '../components/grid-content';
import RowLabels from '../components/row-labels';
import ColumnLabels from '../components/column-labels';
import FloatingActionButton from '../components/floating-action-button';
import CircleTransition from '../components/circle-reveal-view';
import CreateClassSchedule from '../components/create-class-schedule';
import {
  showSaveButton,
  enableSaveButton,
  setOnSaveButtonPress,
} from './home';

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

    const { getParam } = this.props.navigation;

    this.revealer = null;
    this.createScheduleFAB = null;
    this.fabAnimation = FABAnimationType.RESET_ROTATE;
    this.animatingFAB = false;

    this.state = {
      updated: true,
      schedules: {},
      tempNewSchedule: null,
    }

    State.subscribeTo(
      'visible-days',
      () => {
        this.setState({ updated: false });
      }
    );

    State.subscribeTo(
      'theme',
      () => {
        this.setState({ updated: false });
      }
    );

    this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);

    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.resetCreateSchedule();
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    });

    this.didBlurListener = this.props.navigation.addListener('didBlur', () => {
      this.resetCreateSchedule();
    });

    this.configureSaveButtonBehavior();
  }

  componentDidMount() {
    this.willBlurListener = this.props.navigation.addListener('willBlur', () =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );

    Storage.getValue(Storage.Keys.schedules, '{}')
    .then(schedules => {
      this.setState({ schedules: JSON.parse(schedules) });
    })
  }

  componentWillUnmount() {
    // this.removeTimeout();
    this.focusListener.remove();
    this.willBlurListener.remove();
    this.didBlurListener.remove();
  }

  configureSaveButtonBehavior() {
    setOnSaveButtonPress(() => {
      // Ocultar el creador de nuevos horarios
      if (this.revealer.getVisible()) {
        this.revealer.collapse();
      }

      // Agregar el nuevo horario creado a la cuadrícula
      let { schedules } = this.state;
      schedules = JSON.parse(JSON.stringify(schedules));

      // FIXME: La idea es tener un id único por materia, no por horario de
      //        clase, es decir, si una materia tiene varios horarios deberían
      //        estar todos bajo el mismo id

      let { color } = this.state.tempNewSchedule;

      schedules[Utils.uuidv4()] = {
        schedules: [ this.state.tempNewSchedule ],
        name: this.state.tempNewSchedule.name,
        color,
      };

      this.setState({
        schedules,
        tempNewSchedule: {},
      });

      // Guardar los nuevos horarios en el disco
      Storage.storeValue(Storage.Keys.schedules, JSON.stringify(schedules));

      // Registrar este color como reciente
      if (!State.recentColors.includes(color)) {
        let recentColors = [ color ].concat(State.recentColors);
        recentColors.pop();

        State.setRecentColors(recentColors);
      }

      // Resetear el botón con el signo de +
      const animation = FABAnimationType.RESET_ROTATE;
      this.animatingFAB = true;
      this.createScheduleFAB.animate(FABAnimations[animation])
      .then(() => {
        this.fabAnimation = animation;
        this.animatingFAB = false;
      });
    });
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

  itsVisible(schedule) {
    let {
      startDay,
      endDay,
      startTime,
      endtime,
    } = schedule;

    let { visibleDays } = State;

    // TODO: Hay que comprobar basado en la hora también
    return (
      visibleDays.includes(startDay) ||
      visibleDays.includes(endDay)
    )
  }

  renderClassesCells() {
    let firstHour = Utils.numberToMomentHour(State.visibleHours.start);
    let lastHour = Utils.numberToMomentHour(State.visibleHours.end);

    let { schedules: subjects } = this.state;
    let keys = Object.keys(subjects);


    return keys.map(key => {
      let subject = subjects[key];
      let { schedules } = subject;

      return schedules.map((classSchedule, j) => {
        let { color: backgroundColor } = subject;

        if (!Utils.emptyString(classSchedule.color)) {
          backgroundColor = classSchedule.color;
        }

        let {
          startDay,
          endDay,
          startTime,
          endTime,
        } = classSchedule;

        if (this.itsVisible(classSchedule)) {
          let children = [];

          for (let day=startDay; day<=endDay; day++) {
            if (!State.visibleDays.includes(day)) {
              continue;
            }

            let starts;
            let ends;
            let visibleStart = moment(State.visibleHours.start, 'HH');
            let visibleEnd = moment(State.visibleHours.end + 1, 'HH');
  
            if (day > startDay) {
              starts = moment(State.visibleHours.start, 'HH');
            } else {
              starts = moment(startTime, 'HH:mm');

              if (starts.diff(visibleStart) < 0) {
                starts = moment(visibleStart, 'HH');
              }
            }

            if (day < endDay) {
              ends = moment(State.visibleHours.end + 1, 'HH');
            } else {
              ends = moment(endTime, 'HH:mm');

              if (ends.diff(visibleEnd) > 0) {
                ends = visibleEnd;
              }
            }

            let diff = ends.diff(starts, 'minutes');

            let betweenSurplus = diff / 60 * (Consts.Sizes.CellMargin * 2);
            let beforeSurplus = starts.diff(firstHour, 'minutes') / 60 * (Consts.Sizes.CellMargin * 2)

            let dynamicStyles = {
              cell: {
                position: 'absolute',
                top: Consts.Sizes.CellHeight / 60 * starts.diff(firstHour, 'minutes') + beforeSurplus + Consts.Sizes.columnLabelHeight,
                width: Consts.Sizes.CellWidth + Consts.Sizes.CellMargin,
                height: Consts.Sizes.CellHeight / 60 * diff + betweenSurplus,
                backgroundColor,
              },
    
              text: {
                fontSize: 20,
                color: Colors.getTextColorForBackground(backgroundColor),
              },
            };
  
            dynamicStyles.cell.left = State.visibleDays.indexOf(day) *
                                      (Consts.Sizes.CellWidth + 2 * Consts.Sizes.CellMargin) +
                                      Consts.Sizes.CellMargin / 2 + Consts.Sizes.rowLabelWidth;

            children.push(
              <View
                key={ day }
                style={[
                  styles.cell,
                  dynamicStyles.cell
                ]}
              >
  
                <Text style={ dynamicStyles.text }>
                  { subject.name }
                </Text>
              </View>
            );
          }

          return children;
        } else {
          // Esta clase no se ve
          return null;
        }
      });
    });
  }

  render() {
    this.state.updated = true;

    const theme = Colors.Themes[State.theme];
    const cellsByRow = Utils.getCellsByRow(State.visibleHours, State.visibleDays);

    let dStyles = StyleSheet.create({
      contentContainer: {
        height: (Consts.Sizes.CellHeight + Consts.Sizes.CellMargin * 2) * (State.visibleHours.end - State.visibleHours.start) + Consts.Sizes.columnLabelHeight,
        width: (Consts.Sizes.CellWidth + Consts.Sizes.CellMargin * 2) * State.visibleDays.length + Consts.Sizes.rowLabelWidth,
      },
    });

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.gridBackground
        }}
      >

        <StatusBar
          backgroundColor={ Colors.primaryDark }
          barStyle="light-content"
          hidden={ false }
        />

        <SafeAreaView
          style={{ flex: 1 }}
        >

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
            style={ styles.container }
          >

            <ScrollViewChild scrollDirection={ 'both' }>
              <GridContent cellsByRow={ cellsByRow } />
            </ScrollViewChild>

            <ScrollViewChild
              scrollDirection={ 'both' }
              style={ styles.cellsContainer }
            >

              { this.renderClassesCells() }
              { /* <Text style={{ fontSize: 30 }}>TEST</Text> */ }
            </ScrollViewChild>

            <ScrollViewChild
              scrollDirection={ 'vertical' }
              style={ styles.rowLabelsContainer }
            >

              <RowLabels cellsByRow={ cellsByRow } />
            </ScrollViewChild>

            <ScrollViewChild
              scrollDirection={ 'horizontal' }
              style={ styles.columnLabelsContainer }
            >

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

          <CreateClassSchedule
            onDataChange={ (valid, data) => {
              this.setState({ tempNewSchedule: data });
            }}
          />

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
          }}
        />

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
