import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import moment from 'moment';

import i18n from '../i18n';
import Utils from '../utils/utils';

import Field from './field';
import TimePickerButton from './time-picker-button';
import { Spacer40, FlexSpacer } from './spacer';
import FloatingActionButton from './floating-action-button';

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
      <View style={{ flex: 1, backgroundColor: '#aaaaff' }}>
        <Field
          iconName={ 'book-open-page-variant' }
          placeholder={ i18n.t('field-class-name') } />

        <Field
          placeholder={ i18n.t('field-details') } />

        <View style={ styles.hbox }>
          <FlexSpacer />

          <Text style={ styles.timePickerTitle }>
            { i18n.t('field-start') }
          </Text>
          <TimePickerButton />

          <FlexSpacer />

          <Text style={ styles.timePickerTitle }>
            { i18n.t('field-end') }
          </Text>

          <TimePickerButton />

          <FlexSpacer />
        </View>

        <FlexSpacer />

        {/*
        <View style={{ flexDirection: 'row', paddingRight: 66 }}>
          <FlexSpacer />

          <FloatingActionButton
            iconName={ 'close' }
            color={ '#ffaaaa' }
            style={{ position: 'relative' }}
            onPress={ () => {
              console.log('press');
          }} />

        </View>
        */}
      </View>
    )
  }
}

let styles = StyleSheet.create({
  hbox: {
    flexDirection: 'row',
    height: 32,
    alignItems: 'center',
  },

  timePickerTitle: {
    fontSize: 16,
  },
});
