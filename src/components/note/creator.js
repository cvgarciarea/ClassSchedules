import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import PropTypes from 'prop-types';

import i18n from '../../i18n';
import Utils from '../../utils/utils';
import State from '../../utils/state';
import Colors from '../../utils/colors';

import ColorPickerPallete from '../color-picker-pallete';

class InputButton extends React.Component {

  static propTypes = {
    icon: PropTypes.string,
    color: PropTypes.string,
    onPress: PropTypes.func,
  };

  render() {
    const {
      icon,
      color,
      onPress,
    } = this.props;

    const size = 50;

    return (
      <TouchableOpacity
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 4,
        }}
        onPress={ onPress }
      >
        <Icon
          name={ icon }
          color={ '#fff' }
          size={ size * 0.70 }
        />
      </TouchableOpacity>
    );
  }
}

/**
 * TODO: Poder quitarle el color a una nota.
 */
export default class NoteCreator extends React.Component {

  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    classID: PropTypes.string,
    color: PropTypes.string,
    data: PropTypes.array,
  };

  static defaultProps = {
    id: null,
    title: '',
    classID: null,
    color: null,
    data: [],
  };

  constructor(props) {
    super(props);

    const {
      id,
      title,
      classID,
      color,
      data,
    } = this.props;

    this.state = {
      id,
      title,
      classID,
      color,
      data,
    };

    this.renderedOnce = false;
  }

  getNote() {
    return {
      id: this.state.id,
      title: this.state.title,
      classID: this.state.classID,
      color: this.state.color,
      data: this.state.data,
    };
  }

  goToGallery(croppingOptions) {
    croppingOptions = {
      ...croppingOptions,
      cropping: true,
      includeBase64: true,
      freeStyleCropEnabled: true,
      cropperToolbarTitle: '',
      multiple: true,
      mediaType: 'photo',
    };

    ImagePicker.openPicker(croppingOptions)
    .then(medias => {
      for (let mediaData of medias) {
        console.log(mediaData);
      }

      // for (let imageData of images) {
        /**
         * imageData:
         * data: "base64"
         * modificationDate: "timestamp"
         * size: Number
         * mime: "mimetype"
         * height: Number
         * width: Number
         * path: "file:///..."
         */
        /*
        */
      // }
    })
    .catch(error => {
      console.log('ERROR AL RECORTAR LA FOTO', error)
    });
  }

  renderValues() {
    const theme = Colors.Themes[State.theme];

    const {
      width: screenWidth,
      height: screenHeight,
    } = Dimensions.get('window');

    const imagePadding = 20;

    return this.state.data.map((value, index) => {
      switch (value.type) {
        case 'text':
          return (
            <TextInput
              key={ index }
              multiline={ true }
              value={ this.state.data[index].body }
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.backgroundLight,
                  color: Colors.getTextColorForBackground(theme.backgroundLight),
                },
              ]}
              onChangeText={ text => {
                // TODO: Encontrar una manera más eficiente de hacer esto
                let { data } = this.state;
                data = JSON.parse(JSON.stringify(data));
                data[index].body = text;

                this.setState({ data });
              }}
            />
          );

        case 'image':
          return value.images.map((image, imageIndex) => {
            const aspectRatio = image.width / image.height;
            let width = screenWidth - imagePadding * 2;
            let height;

            if (screenHeight > screenWidth) {
              height = width * aspectRatio;
            } else {
              height = width / aspectRatio;
            }

            return (
              <Image
                key={ imageIndex }
                source={{ uri: image.src }}
                style={{
                  width,
                  height,
                  marginLeft: imagePadding,
                  borderRadius: 4,
                  marginBottom: 10,
                }}
              />
            );
          });

        default:
          return (
            <View
              key={ index }
            />
          );
      }
    });
  }

  renderAddNewValue() {
    const theme = Colors.Themes[State.theme];

    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderRadius: 4,
            borderColor: theme.foregroundLight,
            backgroundColor: theme.backgroundLight,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              paddingVertical: 4,
              color: theme.foreground,
            }}
          >
            { i18n.t('add') }
          </Text>

          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <InputButton
              icon={ 'textbox' }
              color={ '#8EC75C' }
              onPress={ () => {
                let { data } = this.state;
                data = JSON.parse(JSON.stringify(data));
                data.push({
                  type: 'text',
                  body: '',
                });

                this.setState({ data });
              }}
            />

            <InputButton
              icon={ 'image' }
              color={ '#9D34A0' }
              onPress={ () => {
                this.goToGallery();
              }}
            />

            <InputButton
              icon={ 'camera' }
              color={ '#00A263' }
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <InputButton
              icon={ 'microphone' }
              color={ '#F67A22' }
            />

            <InputButton
              icon={ 'file-document' }
              color={ '#00A9F1' }
            />

            <InputButton
              icon={ 'gesture' }
              color={ '#5E63CA' }
            />
          </View>

        </View>
      </View>
    );
  }

  render() {
    const theme = Colors.Themes[State.theme];

    return (
      <ScrollView
        contentContainerStyle={ styles.main }
      >

        <TextInput
          placeholder={ i18n.t('title') }
          value={ this.state.title }
          style={[
            styles.textInput,
            {
              fontWeight: 'bold',
              backgroundColor: theme.backgroundLight,
              color: Colors.getTextColorForBackground(theme.backgroundLight),
              marginHorizontal: 10,
            },
          ]}
          onChangeText={ title => {
            this.setState({ title });
          }}
        />

        <ColorPickerPallete
          selectedColor={ this.state.color }
          onSelect={ color => {
            this.setState({ color });
          }}
        />

        <View
          style={{ height: 10 }}
        />

        { this.renderValues() }
        { this.renderAddNewValue() }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  textInput: {
    marginVertical: 10,
    marginHorizontal: 20,
    fontSize: 18,
    borderRadius: 4,
    padding: 5,
  },
});
