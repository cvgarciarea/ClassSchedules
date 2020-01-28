import React from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  BackHandler,
  SafeAreaView,
  TouchableOpacity,
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
  setSaveButtonVisible,
  enableSaveButton,
  setOnSaveButtonPress,
  setDeleteButtonVisible,
  setOnDeleteButtonPress,
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
    this.classScheduleCreatror = null;

    this.state = {
      updated: true,
      schedules: {},
      tempNewSchedule: null,
      selectionMode: 'normal',  // 'normal' | 'selecting'
      selection: {},
    };

    State.subscribeTo(
      'visible-hours',
      () => {
        this.setState({ updated: false });
      }
    );

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
    this.configureDeleteButtonBehavior();
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
      const format = 'HH:mm';
      const {
        name,
        startTime,
        endTime,
        startDay,
        endDay,
        color,
      } = this.state.tempNewSchedule;

      let startHour = moment(startTime, format);
      let endHour = moment(endTime, format);

      let correctSchedule = true;

      if (startHour.diff(endHour) === 0 && startDay === endDay) {
        // Mismo horario de inicio y fin
        correctSchedule = false;
        this.classScheduleCreatror.showWarning('no-time-diff');

      } else if (startDay > endDay || (startHour.diff(endHour) > 0 && startDay === endDay)) {
        // El fin está después del inicio
        correctSchedule = false;
        this.classScheduleCreatror.showWarning('end-before-start');
      }

      if (!correctSchedule) {
        return;
      }

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

      schedules[Utils.uuidv4()] = {
        schedules: [ this.state.tempNewSchedule ],
        name,
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

  configureDeleteButtonBehavior() {
    setOnDeleteButtonPress(() => {
      this.deleteSelectedClassSchedules();
    });
  }

  resetCreateSchedule() {
    let revealed = !Utils.emptyValue(this.revealer) && this.revealer.getVisible();
    let rotated = !Utils.emptyValue(this.createScheduleFAB) &&
                  this.fabAnimation === FABAnimationType.ROTATE;

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
    );
  }

  /**
   * Revisa si un horario de clase está actualmente seleccionado.
   * 
   * @param {String} id    Id de la materia.
   * @param {Number} index Índice del horario dentro de la materia.
   * 
   * @return {Boolean}
   */
  isSelected(id, index) {
    return Utils.isDefined(this.state.selection[id]) &&
           this.state.selection[id].includes(index);
  }

  /**
   * Selecciona el horario de índice `index` de la materia con id `id`
   * 
   * @param {String} id    Id de la materia.
   * @param {Number} index Índice del horario dentro de la materia.
   */
  select(id, index) {
    if (!this.isSelected(id, index)) {
      let { selection } = this.state;
      selection = JSON.parse(JSON.stringify(selection));

      if (!Utils.isDefined(selection[id])) {
        selection[id] = [];
      }

      selection[id].push(index);

      setDeleteButtonVisible(true);

      this.setState({
        selection,
        selectionMode: 'selecting',
      });
    }
  }

  /**
   * Deselecciona el horario de índice `index` de la materia con id `id`
   * 
   * @param {String} id    Id de la materia.
   * @param {Number} index Índice del horario dentro de la materia.
   */
  unselect(id, index) {
    if (this.isSelected(id, index)) {
      let { selection } = this.state;
      selection = JSON.parse(JSON.stringify(selection));

      if (Utils.isDefined(selection[id])) {
        selection[id] = selection[id].remove(index);
      }

      const selectionMode = this.thereIsSelectedClasses(selection) ? 'selecting' : 'normal';

      if (selectionMode === 'normal') {
        setDeleteButtonVisible(false);
      }

      this.setState({
        selection,
        selectionMode,
      });
    }
  }

  /**
   * Revisa que haya algún horario seleccionado.
   * 
   * @param {Object} selection Opcional, objecto con la estructura
   *                           de this.state.selection
   * 
   * @return {Boolean}
   */
  thereIsSelectedClasses(selection=null) {
    if (!Utils.isDefined(selection)) {
      selection = this.state.selection;
    }

    let foundSelectedClassSchedule = false;
    let keys = Object.keys(selection);

    for (let i=0; i<keys.length && !foundSelectedClassSchedule; i++) {
      foundSelectedClassSchedule = selection[keys[i]].length > 0;
    }

    return foundSelectedClassSchedule;
  }

  /**
   * Borra todos los horarios seleccionados.
   */
  deleteSelectedClassSchedules() {
    let { schedules } = this.state;
    schedules = JSON.parse(JSON.stringify(schedules));

    for (let key in this.state.selection) {
      let selected = this.state.selection[key];

      /**
       * Es importante ordenar de forma inversa porque al borrar un horario
       * los horarios con índice mayor cambian de índice (se les reduce en
       * 1) provocando resultados indeseados y, en según qué casos, errores
       * por índice fuera de rango, ejemplo:
       * 
       * let arr = [ 5, 3, 1, 8, 6 ];
       * let aBorrar = [ 0, 2, 1 ];
       * 
       * for (let index of aBorrar) {
       *   arr.splice(index, 1)
       * }
       * 
       * Primera iteración:
       * arr.splice(0, 1)
       * arr === [ 3, 1, 8, 6 ]
       * 
       * Segunda iteracion:
       * arr.splice(2, 1);
       * arr === [ 3, 1, 6 ]
       * 
       * Tercera iteración:
       * arr.splice(1, 1);
       * arr === [ 3, 6 ]
       * 
       * Resultado:
       * arr === [ 3, 6 ]
       * 
       * Resultado esperado:
       * arr === [ 8, 6 ]
       * 
       * Si se ordena de forma inversa no se alteran los índices de los
       * elementos aún por borrar, ejemplo:
       * 
       * let arr = [ 5, 3, 1, 8 ];
       * let aBorrar = [ 0, 2, 1 ].sort().reverse();;
       * 
       * for (let index of aBorrar) {
       *   arr.splice(index, 1)
       * }
       * 
       * Primera iteración:
       * arr.splice(2, 1);
       * arr === [ 5, 3, 8, 6 ]
       * 
       * Segunda iteración:
       * arr.splice(1, 1);
       * arr === [ 5, 8, 6 ]
       * 
       * Tercera iteración:
       * arr.splice(0, 1);
       * arr === [ 8, 6 ]
       */

      selected.sort().reverse();

      for (let index of selected) {
        schedules[key].schedules.splice(index, 1);
      }
    }

    Storage.storeValue(Storage.Keys.schedules, JSON.stringify(schedules));

    this.setState({
      schedules,
      selectionMode: 'normal',
      selection: {},
    });

    setDeleteButtonVisible(false);
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
            let visibleEnd = moment(State.visibleHours.end, 'HH');
  
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
                left: State.visibleDays.indexOf(day) *
                      (Consts.Sizes.CellWidth + 2 * Consts.Sizes.CellMargin) +
                      Consts.Sizes.CellMargin / 2 + Consts.Sizes.rowLabelWidth,
                backgroundColor,                borderStyle: 'dashed',
                borderRadius: 1,
                borderColor: Colors.Themes[State.theme].foreground,
              },
    
              text: {
                fontSize: 20,
                color: Colors.getTextColorForBackground(backgroundColor),
              },
            };

            if (this.isSelected(key, j)) {
              dynamicStyles.cell.borderWidth = 6;
            }

            children.push(
              <TouchableOpacity
                key={ day }
                style={[
                  styles.cell,
                  dynamicStyles.cell
                ]}
                onPress={ () => {
                  if (this.state.selectionMode === 'selecting') {
                    if (this.isSelected(key, j)) {
                      this.unselect(key, j);
                    } else {
                      this.select(key, j);
                    }
                  } else {
                    console.log('EDITAR', classSchedule);
                  }
                }}
                onLongPress={ () => {
                  if (this.isSelected(key, j)) {
                    this.unselect(key, j);
                  } else {
                    this.select(key, j);
                  }
                }}
              >
  
                <Text
                  style={ dynamicStyles.text }
                >
                  { subject.name }
                </Text>

                {
                  !Utils.emptyString(classSchedule.description) ?
                    <Text
                      style={[
                        dynamicStyles.text,
                        { opacity: 0.75 }
                      ]}
                    >

                      { classSchedule.description }
                    </Text>
                  :
                    null
                }
              </TouchableOpacity>
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

    let contentContainerStyle = {
      height: (Consts.Sizes.CellHeight + Consts.Sizes.CellMargin * 2) * (State.visibleHours.end - State.visibleHours.start) + Consts.Sizes.columnLabelHeight,
      width: (Consts.Sizes.CellWidth + Consts.Sizes.CellMargin * 2) * State.visibleDays.length + Consts.Sizes.rowLabelWidth,
    };

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
            contentContainerStyle={ contentContainerStyle }
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
          expandedCallback={ () => { setSaveButtonVisible(true) }}
          collapsedCallback={ () => { setSaveButtonVisible(false) }}
          bottom={ 41 /* 16 de margen + 50 / 2 de tamaño */ }
          right={ 41 /* 16 de margen + 50 / 2 de tamaño */ }
          backgroundColor={ theme.background }  // TODO: Probablemente habría
                                                //       que diferenciarlo del
                                                //       fondo, en el tema
                                                //       oscuro apenas se ve
                                                //       el círculo
        >

          <CreateClassSchedule
            ref={ component => this.classScheduleCreatror = component }
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
    paddingBottom: 20,
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
