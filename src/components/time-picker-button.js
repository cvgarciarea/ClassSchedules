import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';

export default class TimePickerButton extends React.Component {

  static defaultProps = {
    time: '08:00',
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
        <TouchableNativeFeedback onPress={ () => { this.setState({ pickerVisible: true }) }}>
          <View style={ styles.buttonBox }>
            <Text style={ styles.timeText }>
              { this.state.time }
            </Text>
          </View>
        </TouchableNativeFeedback>

        <DateTimePicker
          mode={ 'time' }
          isVisible={ this.state.pickerVisible }
          onConfirm={ data => {
            this.setState({
              pickerVisible: false,
              time: moment(data).format('HH:mm'),
            });
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
    fontSize: 16,
  },
})