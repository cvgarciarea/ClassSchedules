import React from 'react';
import {
  View,
  Dimensions,
  ScrollView,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Utils from '../utils/utils';
import State from '../utils/state';
import Colors from '../utils/colors';

class ColorDot extends React.Component {

  static defaultProps = {
    selected: false,
    color: null,
    size: null,
    onPress: null,
  };

  static propTypes = {
    selected: PropTypes.bool,
    color: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    onPress: PropTypes.func,
  };

  render() {
    const {
      size,
      color,
    } = this.props;

    return (
      <TouchableOpacity
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={ this.props.onPress }
      >
        {
          this.props.selected ?
            <View
              style={{
                width: size / 2,
                height: size / 2,
                borderRadius: size / 4,
                backgroundColor: Colors.getTextColorForBackground(color),
              }}
            />
          :
            null
        }
      </TouchableOpacity>
    );
  }
}

export default class ColorPickerPallete extends React.Component {

  static defaultProps = {
    selectedColor: null,
    onSelect: null,
  };

  static propTypes = {
    selectedColor: PropTypes.string,
    onSelect: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      palleteVisible: false,
    };
  }

  render() {
    let { width: screenWidth } = Dimensions.get('window');
    const circlesPerRow = 6;
    const margin = 100;
    const circleSize = (screenWidth - margin) / circlesPerRow;

    const theme = Colors.Themes[State.theme];

    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          {
            State.recentColors.map((color, colorIndex) => {
              return (
                <ColorDot
                  key={ colorIndex }
                  color={ color }
                  size={ circleSize }
                  selected={ this.props.selectedColor === color }
                  onPress={ () => {
                    Utils.secureCall(this.props.onSelect, color);
                  }}
                />
              );
            })
          }

          <TouchableOpacity
            style={{
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.foreground
            }}
            onPress={ () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              this.setState({ palleteVisible: !this.state.palleteVisible });
            }}
          >

            <Icon
              size={ circleSize }
              color={ theme.background }
              name={
                this.state.palleteVisible
                  ? 'chevron-up'
                  : 'chevron-down'
              }
            />
          </TouchableOpacity>
        </View>

        <View
          showsVerticalScrollIndicator={ false }
          style={{
            overflow: 'hidden',
            height: this.state.palleteVisible ? null : 0,
          }}
        >
          {
            Colors.pickerPallete.map((row, rowIndex) => {
              return (
                <View
                  key={ rowIndex }
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: margin / circlesPerRow,
                  }}
                >
                  {
                    row.map((color, colorIndex) => {
                      return (
                        <ColorDot
                          key={ colorIndex }
                          color={ color }
                          size={ circleSize }
                          selected={ this.props.selectedColor === color }
                          onPress={ () => {
                            Utils.secureCall(this.props.onSelect, color);
                          }}
                        />
                      )
                    })
                  }
                </View>
              )
            })
          }
        </View>
      </View>
    );
  }
}