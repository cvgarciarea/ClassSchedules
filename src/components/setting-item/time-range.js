import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import PropTypes from 'prop-types';

import Utils from '../../utils/utils';
import State from '../../utils/state';
import Colors from '../../utils/colors';

import SettingItem from './setting-item';

export default class TimeRangeSettingItem extends SettingItem {

  static defaultProps = {
    ...SettingItem.defaultProps,
    startHour: null,
    endHour: null,
    onChange: null,
  };

  static propTypes = {
    ...SettingItem.propTypes,
    startHour: PropTypes.number,
    endHour: PropTypes.number,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.modalRef = null;
  }

  renderCustomMarker(position) {
    const theme = Colors.Themes[State.theme];
    const markSize = 20;

    const textStyle = {
      fontSize: 14,
      color: theme.foreground,
      alignSelf: 'center',
    };

    let mark = (
      <View
        style={{
          width: markSize,
          height: markSize,
          borderRadius: markSize / 2,
          backgroundColor: theme.foreground,
        }}
      />
    );

    let text = (
      <Text
        style={ textStyle }
      >
        {
          position === 'left'
            ? this.props.startHour
            : this.props.endHour
        }
      </Text>
    );

    switch (position) {
      case 'left':
        return (
          <View>
            { text }
            { mark }
            <Text style={ textStyle } />
          </View>
        );

      case 'right':
        return (
          <View>
            <Text style={ textStyle } />
            { mark }
            { text }
          </View>
        );
    }

    return null;
  }

  bottomChild() {
    const theme = Colors.Themes[State.theme];

    return (
      <MultiSlider
        min={ 0 }
        max={ 24 }
        step={ 1 }
        snapped={ true }
        values={[ this.props.startHour, this.props.endHour ]}
        allowOverlap={ false }
        selectedStyle={{
          backgroundColor: theme.foreground,
        }}
        isMarkersSeparated={true}
        customMarkerLeft={ () => this.renderCustomMarker('left') }
        customMarkerRight={ () => this.renderCustomMarker('right') }
        onValuesChange={ values => {
          Utils.secureCall(this.props.onChange, values);
        }}
      />
    );
  }
}
