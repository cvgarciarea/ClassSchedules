import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import i18n from '../i18n';
import Consts from '../utils/consts';
import Utils from '../utils/utils';
import State from '../utils/state';
import Colors from '../utils/colors';

const days = Object.keys(Consts.Days);
for (let i=0; i<days.length; i++) {
  days[i] = days[i].toLowerCase();
}

class DayButton extends React.Component {

  static defaultProps = {
    day: null,
    active: false,
    style: null,
    onChange: null,
  };

  static propTypes = {
    day: PropTypes.oneOf(days).isRequired,
    active: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const size = 35;
    const theme = Colors.Themes[State.theme];

    return (
      <TouchableOpacity
        onPress={ () => Utils.secureCall(this.props.onChange) }
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:
              this.props.active
                ? theme.foreground
                : theme.background,
          },
          this.props.style,
        ]}
      >
        <Text
          style={{
            color:
              this.props.active
                ? theme.background
                : theme.foreground,
          }}
        >
          { /* Me quedo con la inicial */}
          { i18n.t(this.props.day).slice(0, 1) }
        </Text>
      </TouchableOpacity>
    );
  }
}

export default class WeekdaysPicker extends React.Component {

  static defaultProps = {
    activeDays: [],
    single: false,
    onChange: null,
  };

  static propTypes = {
    activeDays: PropTypes.array.isRequired,
    single: PropTypes.bool,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeDays: [
        Consts.Days.MONDAY,
        Consts.Days.FRIDAY,
      ],
    };
  }

  static getDerivedStateFromProps(props, state) {
    let { activeDays: activeDaysProps } = props;
    let { activeDays: activeDaysState } = state;

    if (!Utils.isDefined(activeDaysProps)) {
      return null;
    }

    for (let i=0; i<activeDaysProps.length; i++) {
      if (activeDaysProps[i] !== activeDaysState[i]) {
        return {
          activeDays: activeDaysProps,
        };
      }
    }

    if (activeDaysProps.length !== activeDaysState.length) {
      return {
        activeDays: activeDaysProps,
      };
    }

    return null;
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        {
          days.map((day, index) => {
            return (
              <DayButton
                key={ index }
                day={ day }
                active={ this.state.activeDays.includes(index) }
                onChange={ () => {
                  let { activeDays } = this.state;
                  let { single } = this.props;

                  if (single) {
                    activeDays = [ index ];
                  } else {
                    activeDays = JSON.parse(JSON.stringify(activeDays));

                    if (activeDays.includes(index)) {
                      activeDays = activeDays.remove(index);
                    } else {
                      activeDays.push(index);
                    }
                  }

                  this.setState(
                    { activeDays },
                    () => Utils.secureCall(this.props.onChange, activeDays)
                  );
                }}
                style={{ marginLeft: index > 0 ? 10 : 0 }}
              />
            );
          })
        }
      </View>
    );
  }
}
