import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Utils from '../../utils/utils';
import State from '../../utils/state';
import Colors from '../../utils/colors';

import SettingItem from './setting-item';

export default class NestedScreenSettingItem extends SettingItem {

  static defaultProps = {
    ...SettingItem.defaultProps,
    navigation: null,
    screenName: null,
    params: null,
  };

  static propTypes = {
    ...SettingItem.propTypes,
    screenName: PropTypes.string.isRequired,
    params: PropTypes.object,
  };

  handlePress() {
    const {
      navigation,
      screenName,
      params,
    } = this.props;

    if (Utils.isDefined(navigation)) {
      navigation.navigate(screenName, params);
    } else {
      console.warn(`No puedo navegar a "${ screenName }" porque no viene navigation como parametro`);
    }
  }

  rightChild() {
    return (
      <Icon
        name={ 'chevron-right' }
        size={ 25 }
        color={ Colors.Themes[State.theme].foreground }
      />
    );
  }
}
