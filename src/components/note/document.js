import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

import State from '../../utils/state';
import Colors from '../../utils/colors';

export default class DocumentSection extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    file: PropTypes.string,
    base64: PropTypes.string,
    onPress: PropTypes.func,
  };

  render() {
    const theme = Colors.Themes[State.theme];
    const {
      name,
      type,
      onPress,
    } = this.props;

    let icon;
    let iconProps = {
      size: 30,
    };

    switch (type) {
      case 'pdf':
        icon = (
          <Icon
            name={ 'file-pdf' }
            color={ '#F8474A' }
            {...iconProps}
          />
        );

        break;

      case 'docx':
        icon = (
          <Icon
            name={ 'file-document' }
            color={ '#59A8F3' }
            {...iconProps}
          />
        );

        break;

      default:
        icon = (
          <Icon
            name={ 'file-document-outline' }
            color={ theme.foreground }
            {...iconProps}
          />
        );

      break;
    }

    return (
      <TouchableOpacity
        onPress={ onPress }
        style={{
          padding: 5,
          backgroundColor: theme.backgroundLight,
          borderRadius: 4,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 4,
        }}
      >
        { icon }

        <Text
          numberOfLines={ 1 }
          ellipsizeMode={ 'tail' }
          style={[
            styles.title,
            {
              color: theme.foreground,
              paddingLeft: iconProps.size / 4,
            }
          ]}
        >
          { name }
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    flexWrap: 'wrap',
  },
});
