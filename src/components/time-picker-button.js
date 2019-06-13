import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
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
      time: this.props.time,
    }
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
              { this.props.time }
            </Text>
          </View>
 
        </TouchableOpacity>

        <DateTimePicker
          mode={ 'time' }
          isVisible={ this.state.pickerVisible }
          onConfirm={ data => {
            this.setState({
              pickerVisible: false,
              // time: moment(data).format('HH:mm'),
            });

            if (!Utils.emptyValue(this.props.onChange)) {
              this.props.onChange(moment(data).format('HH:mm'));
            }
          }}
          onCancel={ () => {
            this.setState({ pickerVisible: false })
          }} />

      </View>
    )
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