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

import InputModal from '../input-modal';
import SettingItem from './setting-item';
import {
  SingleChooser,
} from '../options-chooser';

export default class SelectionSettingItem extends SettingItem {

  static defaultProps = {
    ...SettingItem.defaultProps,
    modalTitle: null,
    options: null,
    selected: null,
    onChange: null,
    showUpModal: null,
    closeModal: null,
  };

  static propTypes = {
    ...SettingItem.propTypes,
    modalTitle: PropTypes.string,
    options: PropTypes.object.isRequired,
    selected: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    showUpModal: PropTypes.func,
    closeModal: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      selected: this.props.selected,
    };

    this.modalRef = null;
  }

  rightChild() {
    let theme = Colors.Themes[State.theme];

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {
          !Utils.emptyValue(this.state.selected) ?
            <Text
              style={{
                marginRight: 5,
                color: theme.foreground,
              }}
            >

              { this.props.options[this.state.selected].title }
            </Text>
          :
            null
        }

        <Icon
          size={ 22 }
          name={ 'menu-down' }
          color={ theme.foreground }
        />
      </View>
    )
  }

  handlePress() {
    let { showUpModal } = this.props;

    if (Utils.isFunction(showUpModal)) {
      let modalNode = showUpModal(
        <InputModal
          key={ Utils.uuidv4() }
          onRequestClose={ () => { Utils.secureCall(this.props.closeModal, modalNode, this.modalRef) }}
          title={ this.props.modalTitle }
          ref={ modal => this.modalRef = modal }
          child={
            <SingleChooser
              useIcons={ false }
              options={ this.props.options }
              selected={ this.state.selected }
              onChange={ key => {
                this.setState({ selected: key });
                Utils.secureCall(this.props.closeModal, modalNode, this.modalRef)
                this._onChange(key);
              }}
            />
          }
        />
      );
    }
  }
}
