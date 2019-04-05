import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Utils from '../utils/utils';
import Colors from '../utils/colors';

import {
  Spacer30,
  FlexSpacer,
} from './spacer';

class ChooserItem extends React.Component {

  /**
   * props:
   * title: string
   * icon: string,
   * iconColor: hex color
   * selected: boolean
   */

   render() {
    let iconSize = 30;
    let icon = null;
    let theme = Colors.Themes[Colors.THEME];

    if (!this.props.useIcon) {
      icon = (
        <Icon
          size={ iconSize * 2 / 3 }
          color={ theme.foreground }
          name={
            this.props.selected ?
              'checkbox-marked-circle'
            : 'checkbox-blank-circle-outline'
        } />
      )
    } else if (!Utils.emptyString(this.props.icon)) {
      icon = (
        <Icon name={ this.props.icon } size={ iconSize } color={ theme.foreground } />
      )
    } else {
      icon = (
        <View style={{ width: iconSize }} />
      )
    }

    return (
      <TouchableNativeFeedback onPress={ () => {
        if (!Utils.emptyValue(this.props.onPress)) {
          this.props.onPress();
        }
      }}>

        <View style={[ styles.itemContainer, { height: iconSize + 10 } ]}>
          { icon }

          <Text
            style={{ paddingLeft: 15, color: theme.foreground }}>
            { this.props.title }
          </Text>

          <FlexSpacer />

          {
            this.props.selected && this.props.useIcon ?
              <Icon
                name={ 'check' }
                size={ iconSize }
                color={ theme.foreground } />
            :
              null
          }

          <Spacer30 />

        </View>
      </TouchableNativeFeedback>
    )
  }
}

export class SingleChooser extends React.Component {

  /**
   * props:
   * options: object
   * onChange: function
   * selected: key
   * useIcons: boolean
   */

   constructor(props) {
    super(props);
  }

  _itemSelected(key) {
    if (!Utils.emptyValue(this.props.onChange)) {
      this.props.onChange(key);
    }
  }

  render() {
    /**
     * this.props.options format:
     * {
     *   id: {
     *     icon: '',
     *     title: '',
     *   }
     * }
     */

    if (Utils.emptyValue(this.props.options)) {
      return null;
    }

    let keys = Object.keys(this.props.options);

    return (
      <View>
        {
          keys.map(key => {
            return (
              <ChooserItem
                key={ key }
                id={ key }
                icon={ 'bell' }
                useIcon={ this.props.useIcons }
                selected={ this.props.selected === key }
                title={ this.props.options[key].title }
                onPress={ () => {
                  this._itemSelected(key);
                }} />
              )
          })
        }
      </View>
    )
  }
}

let styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
})