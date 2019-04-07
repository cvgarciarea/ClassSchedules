import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { version } from '../../package';
import i18n from '../i18n';

import Colors from '../utils/colors';
import Utils from '../utils/utils';

import Toggle from '../components/toggle';
import {
  SingleChooser,
} from '../components/options-chooser';

let modalsIdx = 0;

class InputModal extends React.Component {

  render() {
    let theme = Colors.Themes[Colors.THEME];

    return (
      <View>
        { /* Modal para el fondo */ }
        <Modal
          animationType='fade'
          transparent={ true }
          style={{ width: '100%', height: '100%' }}
          onRequestClose={ () => {} }>

          <View style={ styles.inputModalBackground } />
        </Modal>

        { /* Modal para el input */ }
        <Modal
          animationType='slide'
          style={{ width: '100%', height: '100%' }}
          transparent={ true }
          onRequestClose={ () => {
            if (!Utils.emptyValue(this.props.onRequestClose)) {
              this.props.onRequestClose();
            }
          }}>

          <View style={ styles.inputModalMain }>
            <View style={[ styles.inputModalBox, { backgroundColor: theme.background } ]}>
              <View style={[ styles.inputModalHeader, { backgroundColor: theme.background } ]}>
                <Text style={{ color: theme.foreground }}>Test</Text>
              </View>

              <View style={ styles.inputModalChildBox }>
                { this.props.child }
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

class SettingsSectionHeader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      label: props.label || '',
    }
  }

  render() {
    let theme = Colors.Themes[Colors.THEME];

    return (
      <Text style={{
        padding: 10,
        color: theme.foreground,
        backgroundColor: theme.sectionHeaderBackground,
      }}>

        { this.state.label }
      </Text>
    )
  }
}

class SettingItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: '',
    }
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
    let theme = Colors.Themes[Colors.THEME];

    return (
      <TouchableNativeFeedback onPress={ () => this._handlePress() }>
        <View style={{ padding: 10, flexDirection: 'row', marginRight: 20 }}>
          {
            Utils.emptyString(this.props.icon) ?
              <View style={{ width: 50, height: 30 }} />
            :
              <Icon
                size={ 30 }
                name={ this.props.icon }
                color={ theme.foreground }
                style={{ marginHorizontal: 10, alignSelf: 'center' }} />
          }

          <Text style={{ alignSelf: 'center', color: theme.foreground }}>
            { this.props.label }
          </Text>

          <View style={{ flex: 1 }} />

          <View style={{ alignSelf: 'center' }}>
            {
              !Utils.emptyValue(this.rightChild) ?
                this.rightChild()
              :
                null
            }
          </View>

        </View>
      </TouchableNativeFeedback>
    )
  }
}

class BooleanSettingItem extends SettingItem {

  constructor(props) {
    super(props);

    this.state = {
      value: false,
    }
  }

  rightChild() {
    /*
    return (
      <Switch
        value={ this.state.value }
        onValueChange={ value => { this.setState({ value }) }} />
    )
    */

    return (
      <Toggle active={ false } onToggle={ () => {} } />
    )
  }

  handlePress() {
    let newState = !this.state.value;
    this.setState({ value: newState });
  }
}

class SelectionSettingItem extends SettingItem {

  constructor(props) {
    super(props);

    this.state = {
      selected: this.props.selected,
    }
  }

  rightChild() {
    let theme = Colors.Themes[Colors.THEME];

    return (
      <View style={{ flexDirection: 'row' }}>
        {
          !Utils.emptyValue(this.state.selected) ?
            <Text style={{ marginRight: 5, alignSelf: 'center', color: theme.foreground }}>
              { this.props.options[this.state.selected].title }
            </Text>
          :
            null
        }

        <Icon
          size={ 22 }
          name={ 'menu-down' }
          color={ theme.foreground }
          style={{ alignSelf: 'center' }} />
      </View>
    )
  }

  _requestClose(modal) {
    if (!Utils.emptyValue(this.props.closeModal)) {
      this.props.closeModal(modal);
    }
  }

  handlePress() {
    if (!Utils.emptyValue(this.props.showUpModal)) {
      let modal = this.props.showUpModal(
        <InputModal
          key={ modalsIdx }
          onRequestClose={ () => { this._requestClose(modal) }}
          child={
            <SingleChooser
              useIcons={ false }
              options={ this.props.options }
              selected={ this.state.selected }
              onChange={ key => {
                this.setState({ selected: key });
                this._requestClose(modal);
                this._onChange(key);
              } } />
          } />
      )
    }
  }
}

export default class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      theme: Colors.THEME,
      modals: [],
    };

    this.addModal = this.addModal.bind(this);
    this.removeModal = this.removeModal.bind(this);
  }

  addModal(modal) {
    modalsIdx++;

    let modals = this.state.modals.slice();
    modals.push(modal);
    this.setState({ modals });

    return modal;
  }

  removeModal(modal) {
    this.setState({ modals: this.state.modals.remove(modal) })
  }

  onThemeChanged(theme) {
    Colors.setTheme(theme);
    this.setState({ theme });
  }

  render() {
    // FIXME: Podría tener esto cargado sin tener
    // que crearlo en el render()
    let themes = {
      'light': { title: i18n.t('theme-light') },
      'dark': { title: i18n.t('theme-dark') },
      'amoled': { title: i18n.t('theme-amoled') },
    }

    let theme = Colors.Themes[this.state.theme];

    return (
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {
          this.state.modals.map(modal => {
            return modal;
          })
        }

        <ScrollView>
          <SettingsSectionHeader label={ i18n.t('section-general') } />

          <SelectionSettingItem
            label={ i18n.t('theme') }
            icon={ 'eye' }
            options={ themes }
            selected={ this.state.theme }
            onChange={ theme => this.onThemeChanged(theme) }
            showUpModal={ this.addModal }
            closeModal={ this.removeModal } />

          <SettingItem label={ i18n.t('visible-time-range') } icon={ 'clock' } />
          <SettingItem label={ i18n.t('visible-days' )} icon={ 'calendar-multiselect' } />
          <SettingItem label={ i18n.t('notifications') } icon={ 'bell' } />

          <SettingsSectionHeader label={ i18n.t('section-app-info') } />
          <SettingItem label={ version } icon={ 'developer-board' } />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputModalBackground: {
    flex: 1,
    backgroundColor: '#0000003f',
  },

  inputModalMain: {
    flex: 1,
    flexDirection: 'column-reverse',
  },

  inputModalBox: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    // height: '40%',
    borderWidth: 2,
    borderRadius: 4,
    alignSelf: 'center',
    borderColor: '#000',
    // backgroundColor: '#aaffaa',
  },

  inputModalHeader: {
    borderBottomWidth: 2,
    borderColor: '#000',
    // backgroundColor: '#ffaaaa',
    backgroundColor: '#fff',  // FIXME: depende del tema seleccionado
    padding: 5,
  },

  inputModalChildBox: {
    padding: 5,
  }
});
