import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import moment from 'moment';

import i18n from '../i18n';
import Consts from '../utils/consts';
import Utils from '../utils/utils';

import Field from './field';
import TimePickerButton from './time-picker-button';
import WeekdaysPicker from './weekdays-picker';
import ColorPickerPallete from './color-picker-pallete';
import {
  Spacer20,
  Spacer40,
  FlexSpacer,
} from './spacer';

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
      startTime: this.props.previousStart,
      endTime: this.props.previousEnd,
      startDay: Consts.Days.MONDAY,
      endDay: Consts.Days.MONDAY,
      color: null,
    };
  }

  componentDidMount() {
    this.dataChanged();
  }

  validateFields() {
    let format = 'HH:mm';

    return (
      !Utils.emptyString(this.state.name) &&
      !Utils.emptyString(this.state.startTime) &&
      !Utils.emptyString(this.state.endTime) &&

      this.state.startDay <= this.state.endDay &&
      moment(this.state.startTime, format).diff(moment(this.state.endTime, format)) < 0
    );
  }

  dataChanged() {
    Utils.secureCall(this.props.onDataChange,
      this.validateFields(),
      {
        name: this.state.name,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        startDay: this.state.startDay,
        endDay: this.state.endDay,
        color: this.state.color,
      },
    );
  }

  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Field
          value={ this.state.name }
          iconName={ 'book-open-page-variant' }
          placeholder={ i18n.t('field-subject-name') }
          onChange={ name => {
            this.setState(
              { name },
              () => this.dataChanged(),
            );
          }}
        />

        <ColorPickerPallete
          selectedColor={ this.state.color }
          onSelect={ color => {
            this.setState(
              { color },
              () => this.dataChanged()
            );
          }}
        />

        {/*
        <Field
          value={ this.state.description }
          placeholder={ i18n.t('field-details') }
          onChange={ description => {
            this.setState({ description }, () => { this.dataChanged() })
          }}
        />
        */}

        <Spacer40 />

        <TimePickerButton
          title={ i18n.t('field-start') }
          time={ this.state.startTime }
          onChange={ startTime => {
            console.log(startTime);
            this.setState(
              { startTime },
              () => this.dataChanged()
            );
          }}
        />

        <Spacer20 />

        <View
          style={{ alignItems: 'center' }}
        >
          <WeekdaysPicker
            activeDays={[ this.state.startDay ]}
            single={ true }
            onChange={ days => {
              this.setState({ startDay: days[0] });
            }}
          />
        </View>

        <Spacer40 />

        <TimePickerButton
          title={ i18n.t('field-end') }
          time={ this.state.endTime }
          onChange={ endTime => {
            this.setState({ endTime }, () => { this.dataChanged() });
          }}
        />

        <Spacer20 />

        <View
          style={{ alignItems: 'center' }}
        >
          <WeekdaysPicker
            activeDays={[ this.state.endDay ]}
            single={ true }
            onChange={ days => {
              this.setState({ endDay: days[0] });
            }}
          />
        </View>

        <FlexSpacer />

      </ScrollView>
    );
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
