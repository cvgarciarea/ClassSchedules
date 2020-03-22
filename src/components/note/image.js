import React from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

import State from '../../utils/state';
import Colors from '../../utils/colors';

export default class ImageSection extends React.Component {

  static propTypes = {
    sources: PropTypes.arrayOf(PropTypes.string).isRequired,
    size: PropTypes.number,
    margin: PropTypes.number,
  };

  render() {
    const {
      sources,
      size,
      margin,
    } = this.props;

    const theme = Colors.Themes[State.theme];
    const imageSize = size / 2 - margin * 2;
  
    if (sources.length === 1) {
      return (
        <Image
          source={{ uri: sources[0] }}
          style={[
            styles.basicImage,
            {
              width: size - margin * 2,
              height: size - margin * 2,
              resizeMode: 'contain',
            },
          ]}
        />
      );
    } else if (sources.length > 1) {
      function _renderImage(source, more) {
        return (
          <View
            style={{
              margin: 2,
            }}
          >
            <Image
              source={{ uri: source }}
              style={[
                styles.basicImage,
                {
                  width: imageSize,
                  height: imageSize,
                  resizeMode: 'cover',
                  borderRadius: 4,
                },
              ]}
            />

            {
              more ?
                <View
                  style={{
                    width: imageSize,
                    height: imageSize,
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >

                  <View
                    style={[
                      styles.basicImage,
                      {
                        width: imageSize,
                        height: imageSize,
                        backgroundColor: theme.foregroundLight,
                        opacity: 0.6,
                        position: 'absolute',
                        borderRadius: 4,
                      },
                    ]}
                  />

                  <Icon
                    name={ 'plus' }
                    size={ imageSize - 10 }
                    color={ theme.background }
                  />
                </View>
              :
                null
            }
          </View>
        );
      }

      return (
        <View>
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            { _renderImage(sources[0]) }
            { _renderImage(sources[1]) }
          </View>

          {
            sources.length > 2 ?
              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                { _renderImage(sources[2]) }

                {
                  sources.length >= 4 ?
                    _renderImage(sources[3], sources.length > 4)
                  :
                    null
                }
              </View>
            :
              null
          }

        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  basicImage: {
    borderRadius: 4,
  },
});
