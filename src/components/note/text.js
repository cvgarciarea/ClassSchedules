import React from 'react';
import {
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import State from '../../utils/state';
import Colors from '../../utils/colors';

export default class TextSection extends React.Component {

  static propTypes = {
    body: PropTypes.string,
  };

  render() {
    const theme = Colors.Themes[State.theme];
    const {
      body,
    } = this.props;

    return (
      <Text
        ellipsizeMode={ 'tail' }
        style={{
          color: theme.foreground,
          flexWrap: 'wrap',
        }}
      >
        { body }
      </Text>
    );
  }
}
