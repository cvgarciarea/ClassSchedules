import React from 'react';
import {
  View,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';

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

import Note from '../components/note';

export default class NotesScreen extends FocusListenerScreen {

  constructor(props) {
    super(props);

    this.state = {
      rendered: false,
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
              images: [ 'https://www.morrishospital.org/wp-content/uploads/2018/12/penguin2_2-1024x768.jpg' ],
            },
          ],
        },
        id4: {
          title: 'muchas imagenes',
          data: [
            {
              type: 'image',
              images: [
                'https://amayei.nyc3.digitaloceanspaces.com/2019/10/58e336b26ee69cbfb21d906c57b8ac8f9cb53bdf.jpg',
                'https://scx1.b-cdn.net/csz/news/800/2019/marchofthemu.jpg',
                'https://www.nationalgeographic.com/content/dam/news/2016/06/29/adelie_penguin/01_adelie_penguin.jpg',
                'https://images.axios.com/2KVFKm3seLEb-6dNRPpysqzUTrw=/0x475:5000x3287/1920x1080/2019/04/25/1556175266452.jpg',
                'https://www.realityblurred.com/realitytv/images/2020/03/penguins-falkland-islands.jpg',
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
    };

    this.onFABPress = this.onFABPress.bind(this);
    this.onSaveButtonPress = this.onSaveButtonPress.bind(this);
    this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
  }

  componentDidMount() {
    State.subscribeTo(
      'theme',
      () => this.setState({ rendered: false }),
    );
  }

  didFocus() {
    setOnFABPress(this.onFABPress);
    this.resetCreateReminder();

    this.props.navigation.setParams({ create: false });
  }

  resetCreateReminder() {
    let create = this.props.navigation.getParam('create', false);
    if (!create) {
      animateFAB('create');
    }

    setSaveButtonVisible(create);
    setDeleteButtonVisible(false);
    setOnSaveButtonPress(this.onSaveButtonPress);
    setOnDeleteButtonPress(this.onDeleteButtonPress);
  }

  onFABPress() {
  }

  onSaveButtonPress() {
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
           * bien al cambiar el número de columnas.
           */
        }
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingLeft: noteMargin * 2,
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
                    data={ note.data }
                    size={ noteSize }
                    margin={ noteMargin }
                    onPress={ () => {} }
                    onLongPress={ () => {} }
                    onDelete={ () => {} }
                  />
                )
              })
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}
