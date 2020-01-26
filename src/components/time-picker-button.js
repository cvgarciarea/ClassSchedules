import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import Utils from '../utils/utils';

export default class TimePickerButton extends React.Component {

  static defaultProps = {
    time: '08:00',
    title: null,
    onChange: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      pickerVisible: false,
      time: moment(this.props.time, 'HH:mm'),
    };
  }
  
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={ () => {
            this.setState({ pickerVisible: true })
          }}
        >
          <View style={ styles.buttonBox }>
            {
              !Utils.emptyValue(this.props.title) ?
                <Text style={ styles.title }>
                  { this.props.title }
                </Text>
              :
                null
            }

            <Text style={ styles.timeText }>
              { this.state.time.format('HH:mm') }
            </Text>
          </View>
 
        </TouchableOpacity>

        {
          this.state.pickerVisible ?
            <DateTimePicker
              value={ this.state.time.toDate() }
              mode={ 'time' }
              display={ 'default' }
              onChange={ (event, time) => {
                this.setState({ pickerVisible: false });

                if (event.type === 'set') {
                  let _moment = moment(time);
                  this.setState({ time: _moment });
                  Utils.secureCall(this.props.onChange, _moment.format('HH:mm'));
                }
              }}
            />
          :
            null
        }

      </View>
    );
  }
}

let styles = StyleSheet.create({
  buttonBox: {
    width: 100,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  timeText: {
    fontWeight: 'bold',
    fontSize: 24,
  },

  title: {
    fontSize: 16,
  },
})