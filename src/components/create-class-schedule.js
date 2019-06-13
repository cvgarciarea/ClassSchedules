import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import moment from 'moment';

import i18n from '../i18n';
import Utils from '../utils/utils';

import Field from './field';
import TimePickerButton from './time-picker-button';
import { Spacer40, FlexSpacer } from './spacer';

export default class CreateClassSchedule extends React.Component {

  static defaultProps = {
    previousName: null,
    previousDescription: null,
    previousStart: '08:00',
    previousEnd: '10:00',
    onDataChange: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      name: this.props.previousName,
      description: this.props.previousDescription,
      start: this.props.previousStart,
      end: this.props.previousEnd,
    };
  }

  validateFields() {
    let format = 'HH:mm';

    return (
      !Utils.emptyString(this.state.name) &&
      !Utils.emptyString(this.state.start) &&
      !Utils.emptyString(this.state.end) &&

      moment(this.state.start, format).diff(moment(this.state.end, format) < 0)
    )
  }

  dataChanged() {
    if (!Utils.emptyValue(this.props.onDataChange)) {
      this.props.onDataChange(this.validateFields());
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Field
          value={ this.state.name }
          iconName={ 'book-open-page-variant' }
          placeholder={ i18n.t('field-class-name') }
          onChange={ name => {
            this.setState({ name }, () => { this.dataChanged() })
          }}
        />

        <Field
          value={ this.state.description }
          placeholder={ i18n.t('field-details') }
          onChange={ text => { console.log(text) }}
          onChange={ description => {
            this.setState({ description }, () => { this.dataChanged() })
          }}
        />

        <Spacer40 />

        <View style={ styles.hbox }>
          <TimePickerButton
            title={ i18n.t('field-start') }
            time={ this.state.start }
            onChange={ start => {
              this.setState({ start }, () => { this.dataChanged() });
            }}
          />

          <TimePickerButton
            title={ i18n.t('field-end') }
            time={ this.state.end }
            onChange={ end => {
              this.setState({ end }, () => { this.dataChanged() });
            }}
          />
        </View>

        <FlexSpacer />

      </View>
    )
  }
}

let styles = StyleSheet.create({
  hbox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 35,
  },
});
