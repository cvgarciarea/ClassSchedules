import React from 'react';
import PropTypes from 'prop-types';

import Utils from '../../utils/utils';

import SettingItem from './setting-item';
import WeekdaysPicker from '../weekdays-picker';

export default class WeekdaysSettingItem extends SettingItem {

  static defaultProps = {
    ...SettingItem.defaultProps,
    activeDays: [],
    onChange: null,
  };

  static propTypes = {
    ...SettingItem.propTypes,
    activeDays: PropTypes.array.isRequired,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
    };
  }

  bottomChild() {
    return (
      <WeekdaysPicker
        // activeDays={ this.state.activeDays }
        activeDays={ this.props.activeDays }
        onChange={ days => {
          // this.setState({ activeDays: days });
          Utils.secureCall(this.props.onChange, days);
        }}
      />
    );
  }
}
