import React from 'react';
import {
  View,
  Dimensions,
  ScrollView,
  BackHandler,
  LayoutAnimation,
} from 'react-native';

import Utils from '../utils/utils';
import Storage from '../utils/storage';
import State from '../utils/state';
import Colors from '../utils/colors';

import FocusListenerScreen from './focus-listener';
import {
  animateFAB,
  setOnFABPress,
  setSaveButtonVisible,
  setOnSaveButtonPress,
  setDeleteButtonVisible,
  setOnDeleteButtonPress,
} from './home';

import Note, { NoteCreator } from '../components/note';
import CircleTransition from '../components/circle-reveal-view';

export default class NotesScreen extends FocusListenerScreen {

  constructor(props) {
    super(props);

    this.state = {
      rendered: false,
      tempNote: {},
      notes: [],
      notesData: {},
    };

    this.revealer = null;
    this.noteCreator = null;

    this.onFABPress = this.onFABPress.bind(this);
    this.onSaveButtonPress = this.onSaveButtonPress.bind(this);
    this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
    this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);
  }

  componentDidMount() {
    State.subscribeTo(
      'theme',
      () => this.setState({ rendered: false }),
    );

    Storage.getLargeValue(Storage.Keys.notes, '{}')
    .then(notesData => {
      notesData = JSON.parse(notesData);
      let notes = Object.keys(notesData);

      this.setState({
        notesData,
        notes,
      });
    });
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

  didFocus() {
    setOnFABPress(this.onFABPress);
    this.resetCreateNote();

    this.props.navigation.setParams({ create: false });
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  willBlur() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  saveNotes() {
    Storage.storeLargeValue(
      Storage.Keys.notes,
      JSON.stringify(this.state.notesData)
    );
  }

  resetCreateNote() {
    let create = this.props.navigation.getParam('create', false);
    if (create && Utils.isDefined(this.revealer)) {
      this.revealer.expand();
    } else {
      animateFAB('create');
    }

    let revealed = !Utils.emptyValue(this.revealer) &&
                   this.revealer.getVisible();

    if (revealed) {
      this.revealer.collapse();
      animateFAB('create');
    }

    setSaveButtonVisible(create);
    setDeleteButtonVisible(false);
    setOnSaveButtonPress(this.onSaveButtonPress);
    setOnDeleteButtonPress(this.onDeleteButtonPress);
  }

  onFABPress() {
    if (Utils.isDefined(this.revealer)) {
      if (this.revealer.getVisible()) {
        this.setState({ tempNote: {} });
      }

      this.revealer.toggle();
    }
  }

  onSaveButtonPress() {
    if (Utils.emptyValue(this.noteCreator)) {
      return;
    }

    let note = this.noteCreator.getNote();

    if (Utils.emptyValue(note.id) || !this.state.notes.includes(note.id)) {
      // Es una nota nueva
      const id = Utils.uuidv4();
      this.state.notesData[id] = note;
      let ids = JSON.parse(JSON.stringify(this.state.notes));

      ids.push(id);
      this.setState(
        { notes: ids },
        () => {
          this.saveNotes();
        }
      );
    } else {
      // Se editó una nota ya existente
      this.state.notesData[note.id] = note;
      let ids = JSON.parse(JSON.stringify(this.state.notes));
      this.setState(
        { notes: ids },
        () => {
          this.saveNotes();
        }
      );
    }

    this.revealer.toggle();
    animateFAB('create');
  }

  onDeleteButtonPress() {
  }

  render() {
    const theme = Colors.Themes[State.theme];
    this.state.rendered = true;

    const noteMargin = 18;
    const {
      width: screenWidth,
      height: screenHeight,
    } = Dimensions.get('window');
    const noteSize = Math.min(screenWidth, screenHeight) / 2 - 1.5 * noteMargin;

    return (
      <View
        style={{
          backgroundColor: theme.background,
          flex: 1,
        }}
      >

        {
          /**
           * DISCLAIMER: Utilizo un ScrollView porque Flatlist no funciona muy
           *             bien al cambiar el número de columnas.
           */
        }
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingLeft: noteMargin * 2,
            paddingBottom: noteMargin,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {
              this.state.notes.map((id, index) => {
                let note = this.state.notesData[id];

                return (
                  <Note
                    key={ index }
                    id={ id }
                    title={ note.title }
                    color={ note.color }
                    data={ note.data }
                    size={ noteSize }
                    margin={ noteMargin }
                    onPress={ () => {
                      animateFAB('cancel');

                      let copy = JSON.parse(JSON.stringify(note));
                      copy.id = id;
                      this.setState({ tempNote: copy });

                      if (!this.revealer.getVisible()) {
                        this.revealer.toggle();
                      }
                    }}
                    onLongPress={ () => {} }
                    onDelete={ () => {
                      /**
                       * TODO: Preguntar por cofirmación antes de borrar, o
                       *       crear una especie de papelera de notas.
                       */

                       // Quitar del objeto que almacena todas las notas
                       let { notes, notesData } = this.state;
                       notesData = JSON.parse(JSON.stringify(notesData));
                       delete notesData[id];

                       // Quitar del arreglo con los ids de las notas
                       notes = JSON.parse(JSON.stringify(notes));
                       notes = notes.removeAll(id);

                       // Guardar en disco
                       Storage.storeLargeValue(
                         Storage.Keys.notes,
                         JSON.stringify(notesData),
                       );

                       // Actualizar estado
                       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

                       this.setState({
                         notes,
                         notesData,
                       });
                    }}
                  />
                );
              })
            }
          </View>
        </ScrollView>

        <CircleTransition
          ref={ ref => this.revealer = ref }
          expandedCallback={ () => {
            setSaveButtonVisible(true);
          }}
          collapsedCallback={ () => {
            setSaveButtonVisible(false);
          }}
          bottom={ -20 }
          right={ screenWidth / 2 }
          backgroundColor={ theme.background }
        >

          <NoteCreator
            ref={ creator => this.noteCreator = creator }
            {...this.state.tempNote}
          />
        </CircleTransition>

      </View>
    );
  }
}
