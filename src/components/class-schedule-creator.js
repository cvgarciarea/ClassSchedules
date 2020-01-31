import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import i18n from '../i18n';
import Consts from '../utils/consts';
import Utils from '../utils/utils';
import State from '../utils/state';
import Colors from '../utils/colors';

import Field from './field';
import TimePickerButton from './time-picker-button';
import WeekdaysPicker from './weekdays-picker';
import ColorPickerPallete from './color-picker-pallete';
import {
  Spacer20,
  Spacer40,
  FlexSpacer,
} from './spacer';

export default class ClassScheduleCreator extends React.Component {

  static defaultProps = {
    subjectID: null,
    scheduleID: null,
    previousName: null,
    previousDescription: null,
    previousStartTime: '08:00',
    previousEndTime: '10:00',
    previousStartDay: Consts.Days.MONDAY,
    previousEndDay: Consts.Days.MONDAY,
    previousColor: null,
    onDataChange: null,
  };

  static propTypes = {
    subjectID: PropTypes.string,
    scheduleID: PropTypes.string,
    previousName: PropTypes.string,
    previousDescription: PropTypes.string,
    previousStartTime: PropTypes.string,
    previousEndtime: PropTypes.string,
    previousStartDay: PropTypes.oneOf(Consts.Days),
    previousEndDay: PropTypes.oneOf(Consts.Days),
    onDataChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    let { previousColor } = this.props;

    if (Utils.emptyValue(previousColor)) {
      previousColor = State.recentColors[0];
    }

    this.state = {
      subjectID: this.props.subjectID,
      scheduleID: this.props.scheduleID,
      name: this.props.previousName,
      description: this.props.previousDescription,
      startTime: this.props.previousStartTime,
      endTime: this.props.previousEndTime,
      startDay: this.props.previousStartDay,
      endDay: this.props.previousEndDay,
      color: previousColor,

      warnings: [], // 'no-time-diff', 'end-before-start'
      endDayModified: false,
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
        id: this.state.scheduleID,
        subjectID: this.state.subjectID,
        name: this.state.name,
        description: this.state.description,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        startDay: this.state.startDay,
        endDay: this.state.endDay,
        color: this.state.color,
      },
    );
  }

  showWarning(warningName) {
    let { warnings } = this.state;

    if (!warnings.includes(warningName)) {
      warnings = JSON.parse(JSON.stringify(warnings));
      warnings.push(warningName);

      this.setState({ warnings });
    }
  }

  render() {
    let { warnings } = this.state;
    const noDiffTimeWarning = warnings.includes('no-time-diff');
    const endBeforeStartWarning = warnings.includes('end-before-start');
    let timeWarning = noDiffTimeWarning || endBeforeStartWarning;

    let warningText = null;
    if (noDiffTimeWarning) {
      warningText = i18n.t('warning-no-diff-time');
    } else if (endBeforeStartWarning) {
      warningText = i18n.t('warning-end-before-start');
    }

    const theme = Colors.Themes[State.theme];

    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      >

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

        <Field
          value={ this.state.description }
          iconName={ 'information-outline' }
          placeholder={ i18n.t('field-details') }
          onChange={ description => {
            this.setState(
              { description },
              () => this.dataChanged()
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

        <Spacer20 />

        <View
          style={{
            borderWidth: timeWarning ? 2 : 0,
            marginHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 4,
            borderColor: theme.warning,
          }}
        >
          {
            timeWarning ?
              <Text
                style={{
                  color: theme.warning,
                  paddingBottom: 20,
                  paddingLeft: 10,
                  fontSize: 16,
                }}
              >
                { warningText }
              </Text>
            :
              null
          }

          <TimePickerButton
            title={ i18n.t('field-start') }
            time={ this.state.startTime }
            onChange={ startTime => {
              warnings = JSON.parse(JSON.stringify(warnings));
              warnings = warnings.remove('no-time-diff')
                                 .remove('end-before-start');

              this.setState(
                {
                  startTime,
                  warnings,
                },
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
                warnings = JSON.parse(JSON.stringify(warnings));
                warnings = warnings.remove('no-time-diff')
                                   .remove('end-before-start');

                this.setState(
                  {
                    startDay: days[0],
                    endDay: this.state.endDayModified ? this.state.endDay : days[0],
                    warnings,
                  },
                  () => this.dataChanged()
                );
              }}
            />
          </View>

          <Spacer40 />

          <TimePickerButton
            title={ i18n.t('field-end') }
            time={ this.state.endTime }
            onChange={ endTime => {
              warnings = JSON.parse(JSON.stringify(warnings));
              warnings = warnings.remove('no-time-diff')
                                 .remove('end-before-start');

              this.setState(
                {
                  endTime,
                  warnings,
                },
                () => this.dataChanged()
              );
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
                warnings = JSON.parse(JSON.stringify(warnings));
                warnings = warnings.remove('no-time-diff')
                                   .remove('end-before-start');

                this.setState(
                  {
                    endDay: days[0],
                    endDayModified: true,
                    warnings,
                  },
                  () => this.dataChanged()
                );
              }}
            />
          </View>
        </View>

        <FlexSpacer />

      </ScrollView>
    );
  }
}
