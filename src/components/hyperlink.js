import React from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import i18n from '../i18n';
import Utils from '../utils/utils';
import State from '../utils/state';
import Colors from '../utils/colors';

export default class Hyperlink extends React.Component {

  static defaultProps = {
    title: null,
    url: null,
    onPress: null,
  };

  static propTypes = {
    title: PropTypes.string,
    url: PropTypes.string.isRequired,
    onPress: PropTypes.func,
  };

  render() {
    const theme = Colors.Themes[State.theme];

    return (
      <TouchableOpacity
        accessible={ true }
        accessibilityLabel={ `${ i18n.t('link-to') } ${ this.props.url }`}
        accessibilityRole={ 'link' }
        style={{
          minHeight: 30,
          justifyContent: 'center',
        }}
        onPress={ () => {
          let {
            url,
            onPress,
          } = this.props;

          if (Utils.emptyValue(onPress)) {
            Linking.openURL(url)
          } else {
            onPress(url);
          }
        }}
      >
        <Text
          style={{
            color: theme.link,
            borderBottomWidth: 1,
            borderColor: theme.link,
          }}
        >
          { this.props.title || this.props.url }
        </Text>
      </TouchableOpacity>
    );
  }
}
