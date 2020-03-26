import React from 'react';
import {
  View,
  StatusBar,
  Dimensions,
  ScrollView,
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

      /*
      notes: [ 'id1', 'id2', 'id3', 'id4', 'id5' ],
      notesData: {
        id1: {
          title: 'prueba simple',
          data: [
            {
              type: 'text',
              body: 'cuerpo1',
            },
          ],
        },
        id2: {
          title: 'prueba texto largo',
          data: [
            {
              type: 'text',
              body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            },
          ],
        },
        id3: {
          title: 'imagen unica',
          data: [
            {
              type: 'image',
              images: [
                {
                  src: 'https://www.morrishospital.org/wp-content/uploads/2018/12/penguin2_2-1024x768.jpg',
                  width: 1024,
                  height: 768,
                }
              ],
            },
          ],
        },
        id4: {
          title: 'muchas imagenes',
          data: [
            {
              type: 'image',
              images: [
                {
                  src: 'https://amayei.nyc3.digitaloceanspaces.com/2019/10/58e336b26ee69cbfb21d906c57b8ac8f9cb53bdf.jpg',
                  width: 768,
                  height: 512,
                },
                {
                  src: 'https://scx1.b-cdn.net/csz/news/800/2019/marchofthemu.jpg',
                  width: 800,
                  height: 480,
                },
                {
                  src: 'https://www.nationalgeographic.com/content/dam/news/2016/06/29/adelie_penguin/01_adelie_penguin.jpg',
                  width: 2048,
                  height: 1365,
                },
                {
                  src: 'https://images.axios.com/2KVFKm3seLEb-6dNRPpysqzUTrw=/0x475:5000x3287/1920x1080/2019/04/25/1556175266452.jpg',
                  width: 1920,
                  height: 1080,
                },
                {
                  src: 'https://www.realityblurred.com/realitytv/images/2020/03/penguins-falkland-islands.jpg',
                  width: 800,
                  height: 500,
                },
              ],
            },
          ],
        },
        id5: {
          title: 'documentos adjuntos',
          data: [
            {
              type: 'document',
              fileType: 'pdf',
              fileName: 'test.pdf',
            },
            {
              type: 'document',
              fileType: 'docx',
              fileName: 'test.docx',
            },
            {
              type: 'document',
              fileType: 'unknown',
              fileName: 'unknown file'
            }
          ],
        },
      },
      */
    };

    this.revealer = null;
    this.noteCreator = null;

    this.onFABPress = this.onFABPress.bind(this);
    this.onSaveButtonPress = this.onSaveButtonPress.bind(this);
    this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
  }

  componentDidMount() {
    State.subscribeTo(
      'theme',
      () => this.setState({ rendered: false }),
    );

    Storage.getValue(Storage.Keys.notes, '{}')
    .then(notesData => {
      notesData = JSON.parse(notesData);
      let notes = Object.keys(notesData);

      this.setState({
        notesData,
        notes,
      });
    });
  }

  saveNotes() {
    Storage.storeValue(Storage.Keys.notes, JSON.stringify(this.state.notesData));
  }

  didFocus() {
    setOnFABPress(this.onFABPress);
    this.resetCreateNote();

    this.props.navigation.setParams({ create: false });
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

                      /**
                       * TODO: Guardar en disco los cambios.
                       */

                       let { notes, notesData } = this.state;
                       notesData = JSON.parse(JSON.stringify(notesData));
                       delete notesData[id];

                       notes = JSON.parse(JSON.stringify(notes));
                       notes = notes.removeAll(id);

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
