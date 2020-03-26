import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Utils from '../../utils/utils';
import State from '../../utils/state';
import Colors from '../../utils/colors';

import TextSection from './text';
import ImageSection from './image';
import DocumentSection from './document';

export default class Note extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    color: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    onDelete: PropTypes.func,
    onDrop: PropTypes.func,
    size: PropTypes.number.isRequired,
    margin: PropTypes.number.isRequired,
  };

  render() {
    const theme = Colors.Themes[State.theme];
    const {
      title,
      color,
      data: allData,
      size,
      margin,

      onPress,
      onLongPress,
      onDelete,
    } = this.props;

    let borderColor;
    let backgroundColor;

    if (Utils.isDefined(color)) {
      backgroundColor = color;
      let shadePercent = State.theme === 'light' ? -20 : 40;
      borderColor = Colors.shadeColor(backgroundColor, shadePercent);
    } else {
      borderColor = theme.foreground;
      backgroundColor = theme.background;
    }

    const deleteIconSize = margin * 1.5;

    return (
      <View
        style={{
          paddingTop: margin,
          paddingRight: margin,
          backgroundColor: theme.background,
          width: size,
          height: size,
        }}
      >

        <TouchableOpacity
          onPress={ onPress }
          onLongPress={ onLongPress }
          style={[
            styles.note,
            {
              borderColor,
              backgroundColor,
            },
          ]}
        >
          {
            Utils.isDefined(title) ?
              <Text
                style={[
                  styles.title,
                  {
                    color: Colors.getTextColorForBackground(backgroundColor),
                    marginBottom: margin / 4,
                  }
                ]}
                numberOfLines={ 1 }
                ellipsizeMode={ 'tail' }
              >
                { title }
              </Text>
            :
              null
          }

          {
            allData.map((data, index) => {
              switch (data.type) {
                case 'text':
                  return (
                    <TextSection
                      key={ index }
                      body={ data.body }
                      backgroundColor={ backgroundColor }
                    />
                  );

                case 'image':
                  return (
                    <ImageSection
                      key={ index }
                      sources={ data.images }
                      size={ size }
                      margin={ margin }
                    />
                  );

                case 'document':
                  return (
                    <DocumentSection
                      key={ index }
                      name={ data.fileName }
                      type={ data.fileType }
                    />
                  );

                default:
                  return (
                    <View
                      key={ index }
                    />
                  );
              }
            })
          }
        </TouchableOpacity>

        <TouchableOpacity
          onPress={ onDelete }
          style={{
            position: 'absolute',
            top: deleteIconSize / 4,
            right: deleteIconSize / 4,
            backgroundColor: theme.background,
            borderRadius: deleteIconSize / 2,
          }}
        >
          <Icon
            name={ 'close-circle' }
            size={ deleteIconSize }
            color={ theme.foreground }
            style={{
              borderRadius: deleteIconSize / 2,
            }}
          />
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  note: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },

  title: {
    fontWeight: 'bold',
  },
});
