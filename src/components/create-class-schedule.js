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

  constructor(props) {
    super(props);

    this.state = {
      name: null,
      description: null,
      start: null,
      end: null,
    }
  }

  validateFields() {
    return (
      !Utils.emptyString(this.state.name) &&
      !Utils.emptyString(this.state.start) &&
      !Utils.emptyString(this.state.end) &&

      moment(this.state.start).diff(moment(this.state.end) < 0)
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Field
          iconName={ 'book-open-page-variant' }
          placeholder={ i18n.t('field-class-name') }
        />

        <Field
          placeholder={ i18n.t('field-details') }
        />

        <Spacer40 />

        <View style={ styles.hbox }>
          <TimePickerButton
            title={ i18n.t('field-start') }
          />

          <TimePickerButton
            title={ i18n.t('field-end') }
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
