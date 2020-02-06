import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PropTypes from 'prop-types';
import moment from 'moment';

import Utils from '../../utils/utils';
import State from '../../utils/state';
import Colors from '../../utils/colors';

import SettingItem from './setting-item';

export default class TimeSettingItem extends SettingItem {

  static defaultProps = {
    ...SettingItem.defaultProps,
    time: null,
    timeFormat: 'HH:mm',
    onChange: null,
  };

  static propTypes = {
    ...SettingItem.propTypes,
    time: PropTypes.string.isRequired,
    timeFormat: PropTypes.string,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      timePickerVisible: false,
    };

    this.onTimeChange = this.onTimeChange.bind(this);
  }

  onTimeChange(event, date) {
    this.setState(
      { timePickerVisible: false },
      () => {
        if (event.type === 'set') {
          Utils.secureCall(this.props.onChange, moment(date).format(this.props.timeFormat));
        }
      }
    );
  }

  rightChild() {
    const theme = Colors.Themes[State.theme];

    return (
      <View>
        <Text
          style={{
            color: theme.foreground,
          }}
        >
          { this.props.time }
        </Text>

        {
          this.state.timePickerVisible ?
            <DateTimePicker
              value={ moment(this.props.time, this.props.timeFormat).toDate() }
              mode={ 'time' }
              display={ 'clock' }
              onChange={ this.onTimeChange }
            />
          :
            null
        }
      </View>
    );
  }

  handlePress() {
    this.setState({ timePickerVisible: true });
  }
}
