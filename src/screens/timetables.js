import React from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  BackHandler,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import ScrollView, { ScrollViewChild } from 'react-native-directed-scrollview';

import Consts from '../utils/consts';
import Utils from '../utils/utils';
import Storage from '../utils/storage';
import State from '../utils/state';
import Colors from '../utils/colors';

import FocusListenerScreen from './focus-listener';

import GridContent from '../components/grid-content';
import RowLabels from '../components/row-labels';
import ColumnLabels from '../components/column-labels';
import CircleTransition from '../components/circle-reveal-view';
import ClassScheduleCreator from '../components/class-schedule-creator';
import {
  animateFAB,
  setOnFABPress,
  setSaveButtonVisible,
  setOnSaveButtonPress,
  setDeleteButtonVisible,
  setOnDeleteButtonPress,
} from './home';

export default class TimetablesScreen extends FocusListenerScreen {

  constructor(props) {
    super(props);

    const { getParam } = this.props.navigation;

    this.revealer = null;
    this.classScheduleCreatror = null;

    this.state = {
      updated: true,
      schedules: {},
      tempNewSchedule: null,
      selectionMode: 'normal',  // 'normal' | 'selecting'
      selection: {},
      editingScheduleData: {},
    };

    this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);
    this.onFABPress = this.onFABPress.bind(this);
    this.onSaveButtonPress = this.onSaveButtonPress.bind(this);
    this.deleteSelectedClassSchedules = this.deleteSelectedClassSchedules.bind(this);
  }

  componentDidMount() {
    Storage.getValue(Storage.Keys.schedules, '{}')
    .then(schedules => {
      this.setState({ schedules: JSON.parse(schedules) });
    });

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
  }

  didFocus() {
    let create = this.props.navigation.getParam('create');
    if (create) {
      this.revealer.expand();
    } else {
      animateFAB('create');
      this.resetCreateSchedule();
    }

    setSaveButtonVisible(create);
    setOnFABPress(this.onFABPress);
    setOnSaveButtonPress(this.onSaveButtonPress);
    setOnDeleteButtonPress(this.deleteSelectedClassSchedules);

    this.props.navigation.setParams({ create: false });
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  willBlur() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  didBlur() {
    this.resetCreateSchedule();
    setDeleteButtonVisible(false);

    this.setState({
      selectionMode: 'normal',
      selection: {},
      editingScheduleData: {},
    });
  }

  onFABPress() {
    if (Utils.isDefined(this.revealer)) {
      if (this.revealer.getVisible()) {
        this.setState({ editingScheduleData: {} });
      }

      this.revealer.toggle();
    }
  }

  onSaveButtonPress() {
    const format = 'HH:mm';

    let {
      name,
      description,
      startTime,
      endTime,
      startDay,
      endDay,
      color,
      subjectID,
      id,
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

    // Me aseguro de que el id de materia no esté ya siendo en uso, es muy
    // poco probable, pero no imposible
    if (Utils.emptyString(subjectID)) {
      do {
        subjectID = Utils.uuidv4();
      } while (Object.keys(schedules).includes(subjectID))
    }

    let newSchedule = {
      // FIXME: Debería revisar de que no esté en uso este id?
      id: this.state.tempNewSchedule.id || Utils.uuidv4(),
      subjectID,
      name,
      description,
      startTime,
      endTime,
      startDay,
      endDay,
      color,
    };

    if (Utils.emptyValue(schedules[subjectID])) {
      schedules[subjectID] = {
        schedules: [ newSchedule ],
        name,
        color,
      };
    } else {
      let { schedules: _schedules } = schedules[subjectID];
      let currentIndex = null;

      for (let i=0; i<_schedules.length && Utils.emptyValue(currentIndex); i++) {
        if (_schedules[i].id === id) {
          currentIndex = i;
        }
      }

      if (Utils.emptyValue(currentIndex)) {
        // No existía, signifca que estoy creando un horario nuevo
        _schedules.push(newSchedule);
      } else {
        // Ya existía, significa que estoy actualizando los datos
        _schedules[currentIndex] = this.state.tempNewSchedule;
      }
    }

    this.setState({
      schedules,
      tempNewSchedule: {},
      editingScheduleData: {},
    });

    // TODO: Actualizar notificaciones diarias

    // Guardar los nuevos horarios en el disco
    Storage.storeValue(Storage.Keys.schedules, JSON.stringify(schedules));

    // Registrar este color como reciente
    if (!State.recentColors.includes(color)) {
      let recentColors = [ color ].concat(State.recentColors);
      recentColors.pop();

      State.setRecentColors(recentColors);
    }

    // Resetear el botón con el signo de +
    animateFAB('create');
  }

  resetCreateSchedule() {
    let revealed = !Utils.emptyValue(this.revealer) &&
                   this.revealer.getVisible();

    if (revealed) {
      this.revealer.collapse();
      animateFAB('create');
    }

    return revealed;
  }

  onBackButtonPressAndroid() {
    return this.resetCreateSchedule();
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

    // TODO: Actualizar notificaciones diarias
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
                  dynamicStyles.cell,
                  { zIndex: 1000 }
                ]}
                onPress={ () => {
                  if (this.state.selectionMode === 'selecting') {
                    // Es un toque normal, pero estaba en modo selección así
                    // que marco este horario como seleccionado
                    if (this.isSelected(key, j)) {
                      this.unselect(key, j);
                    } else {
                      this.select(key, j);
                    }
                  } else {
                    // Edito este horario
                    this.setState(
                      {
                        editingScheduleData: {
                          subjectID: classSchedule.subjectID,
                          scheduleID: classSchedule.id,
                          previousName: classSchedule.name,
                          previousDescription: classSchedule.description,
                          previousStartTime: classSchedule.startTime,
                          previousEndTime: classSchedule.endTime,
                          previousStartDay: classSchedule.startDay,
                          previousEndDay: classSchedule.endDay,
                          previousColor: backgroundColor,
                        },
                      },
                      () => {
                        // Cambio el estado del FAB
                        animateFAB('cancel');

                        // Muestro el creador de materias
                        if (!this.revealer.getVisible()) {
                          this.revealer.expand();
                        }
                      }
                    )
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
      height: (Consts.Sizes.CellHeight + Consts.Sizes.CellMargin * 2) *
              (State.visibleHours.end - State.visibleHours.start) +
              Consts.Sizes.columnLabelHeight,
      width: (Consts.Sizes.CellWidth + Consts.Sizes.CellMargin * 2) * State.visibleDays.length + Consts.Sizes.rowLabelWidth,
    };

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.gridBackground
        }}
      >

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
            contentContainerStyle={ contentContainerStyle }
            style={ styles.container }
          >

            <ScrollViewChild
              scrollDirection={ 'both' }
            >
              <GridContent
                cellsByRow={ cellsByRow }
                onCreateClassSchedule={ (day, hour) => {
                  const timeFormat = 'HH:mm';

                  // Creo horario de clase con los datos de la celda
                  this.setState(
                    {
                      editingScheduleData: {
                        previousStartTime: Utils.numberToMomentHour(hour).format(timeFormat),
                        previousEndTime: Utils.numberToMomentHour(hour + 1).format(timeFormat),
                        previousStartDay: day,
                        previousEndDay: day,
                      },
                    },
                    () => {
                      // Cambio el estado del FAB
                      animateFAB('cancel');

                      // Muestro el creador de materias
                      if (!this.revealer.getVisible()) {
                        this.revealer.expand();
                      }
                    }
                  );
                }}
              />

              { this.renderClassesCells() }
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
          bottom={ -20 }
          right={ Dimensions.get('window').width / 2 }
          backgroundColor={ theme.background }  // TODO: Probablemente habría
                                                //       que diferenciarlo del
                                                //       fondo, en el tema
                                                //       oscuro apenas se ve
                                                //       el círculo
        >

          <ClassScheduleCreator
            ref={ component => this.classScheduleCreatror = component }
            {...this.state.editingScheduleData}
            onDataChange={ (valid, data) => {
              this.setState({ tempNewSchedule: data });
            }}
          />

        </CircleTransition>

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
    backgroundColor: '#aaffaa',
  },

  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
