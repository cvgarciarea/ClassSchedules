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
    backgroundColor: PropTypes.string,
  };

  render() {
    const {
      body,
      backgroundColor,
    } = this.props;

    return (
      <Text
        ellipsizeMode={ 'tail' }
        style={{
          color: Colors.getTextColorForBackground(backgroundColor || Colors.Themes[State.theme]),
          flexWrap: 'wrap',
        }}
      >
        { body }
      </Text>
    );
  }
}
