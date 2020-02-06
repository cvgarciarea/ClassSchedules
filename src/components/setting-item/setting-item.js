import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Utils from '../../utils/utils';
import State from '../../utils/state';
import Colors from '../../utils/colors';

import CompatibleTouchable from '../compatible-touchable';

export default class SettingItem extends React.Component {

  static defaultProps = {
    title: null,
    icon: null,
    touchable: true,
    handlePress: null,
    style: null,
  };

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    touchable: PropTypes.bool,
    handlePress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  _handlePress() {
    if (!Utils.emptyValue(this.props.handlePress)) {
      this.props.handlePress();
    } else if (!Utils.emptyValue(this.handlePress)) {
      this.handlePress();
    }
  }

  _onChange(value) {
    if (!Utils.emptyValue(this.props.onChange)) {
      this.props.onChange(value);
    }
  }

  render() {
    let theme = Colors.Themes[State.theme];

    return (
      <CompatibleTouchable
        itsRounded={ false }
        disabled={ !this.props.touchable }
        onPress={ () => this._handlePress() }
      >

        <View
          style={ this.props.style }
        >
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              marginRight: 20,
              alignItems: 'center',
            }}
          >

            <View
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {
                  Utils.emptyString(this.props.icon) ?
                    <View style={{ width: 50, height: 30 }} />
                  :
                    <Icon
                      size={ 30 }
                      name={ this.props.icon }
                      color={ theme.foreground }
                      style={{ marginHorizontal: 10 }}
                    />
                }

                <Text
                  style={{
                    color: theme.foreground,
                    flexWrap: 'wrap',
                    flex: 1,
                  }}
                >
                  { this.props.title }
                </Text>
              </View>

            </View>

            <View>
              {
                Utils.isFunction(this.rightChild) ?
                  this.rightChild()
                :
                  null
              }
            </View>

          </View>
            {
              Utils.isFunction(this.bottomChild) ?
                <View
                  style={{
                    paddingLeft: 65,
                    paddingTop: 10,
                  }}
                >

                  { this.bottomChild() }
                </View>
              :
                null
            }
        </View>
      </CompatibleTouchable>
    );
  }
}
