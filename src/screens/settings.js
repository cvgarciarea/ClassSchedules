import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import i18n from '../i18n';

import Consts from '../utils/consts';
import Utils from '../utils/utils';
import State from '../utils/state';
import Colors from '../utils/colors';

import Toggle from '../components/toggle';
import {
  SingleChooser,
} from '../components/options-chooser';
import WeekdaysPicker from '../components/weekdays-picker';

let modalsIdx = 0;

class InputModal extends React.Component {

  static defaultProps = {
    title: null,
    onRequestClose: null,
  };

  static propTypes = {
    title: PropTypes.string,
    onRequestClose: PropTypes.func,
  };

  render() {
    let theme = Colors.Themes[State.theme];

    return (
      <View>
        { /* Modal para el fondo */ }
        <Modal
          animationType='fade'
          transparent={ true }
          style={{
            width: '100%',
            height: '100%',
          }}
          onRequestClose={ () => Utils.secureCall(this.props.onRequestClose) }
        >

          <TouchableWithoutFeedback
            onPress={ () => { console.log('onPress')} }
          >
            <View style={ styles.inputModalBackground } />
          </TouchableWithoutFeedback>
        </Modal>

        { /* Modal para el input */ }
        <Modal
          animationType={ 'slide' }
          style={{ width: '100%', height: '100%' }}
          transparent={ true }
          onRequestClose={ () => Utils.secureCall(this.props.onRequestClose) }
        >

          <View style={ styles.inputModalMain }>
            <View style={[ styles.inputModalBox, { backgroundColor: theme.background } ]}>
              <View style={[ styles.inputModalHeader, { backgroundColor: theme.background } ]}>
                <Text style={{ color: theme.foreground }}>
                  { this.props.title }
                </Text>
              </View>

              <View style={ styles.inputModalChildBox }>
                { this.props.child }
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

class SettingsSectionHeader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: props.title || '',
    }
  }

  render() {
    let theme = Colors.Themes[State.theme];

    return (
      <Text
        style={{
          padding: 10,
          color: theme.foreground,
          backgroundColor: theme.sectionHeaderBackground,
        }}
      >

        { this.state.title }
      </Text>
    )
  }
}

class SettingItem extends React.Component {

  static defaultProps = {
    title: null,
    icon: null,
    touchable: true,
  };

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    touchable: PropTypes.bool,
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
      <TouchableNativeFeedback
        onPress={ () => this._handlePress() }
        disabled={ !this.props.touchable }
      >

        <View>
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
      </TouchableNativeFeedback>
    );
  }
}

class BooleanSettingItem extends SettingItem {

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      value: false,
    };
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
      <Toggle
        active={ false }
        onToggle={ () => {} }
      />
    );
  }

  handlePress() {
    let newState = !this.state.value;
    this.setState({ value: newState });
  }
}

class TimeRangeSettingItem extends SettingItem {

  static defaultProps = {
    ...SettingItem.defaultProps,
    modalTitle: null,
    startHour: null,
    endHour: null,
    showUpModal: null,
    closeModal: null,
    onChange: null,
  };

  static propTypes = {
    ...SettingItem.propTypes,
    modalTitle: PropTypes.string,
    startHour: PropTypes.number,
    endHour: PropTypes.number,
    showUpModal: PropTypes.func,
    closeModal: PropTypes.func,
    onChange: PropTypes.func,
  };

  handlePress() {
    let { showUpModal } = this.props;

    let {
      startHour,
      endHour,
    } = this.props;

    if (!Utils.isDefined(startHour)) {
      startHour = 0;
    }

    if (!Utils.isDefined(endHour)) {
      endHour = startHour + 1;
    }

    if (Utils.isFunction(showUpModal)) {
      let modal = showUpModal(
        <InputModal
          key={ modalsIdx }
          onRequestClose={ () => { Utils.secureCall(this.props.closeModal, modal) }}
          title={ this.props.modalTitle }
          child={
            <View />
          }
        />
      );
    }
  }
}

class SelectionSettingItem extends SettingItem {

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
      let modal = showUpModal(
        <InputModal
          key={ modalsIdx }
          onRequestClose={ () => { Utils.secureCall(this.props.closeModal, modal) }}
          title={ this.props.modalTitle }
          child={
            <SingleChooser
              useIcons={ false }
              options={ this.props.options }
              selected={ this.state.selected }
              onChange={ key => {
                this.setState({ selected: key });
                Utils.secureCall(this.props.closeModal, modal)
                this._onChange(key);
              }}
            />
          }
        />
      );
    }
  }
}

class WeekdaysSettingItem extends SettingItem {

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

export default class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      theme: State.theme,
      modals: [],
      rendered: false,
    };

    this.addModal = this.addModal.bind(this);
    this.removeModal = this.removeModal.bind(this);
  }

  componentDidMount() {
    State.subscribeTo(
      'visible-days',
      days => {
        this.setState({ rendered: false });
      }
    )
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
    State.setTheme(theme);
    this.setState({ theme });
  }

  onVisibleDaysChanged(days) {
    State.setVisibleDays(days);
  }

  render() {
    this.state.rendered = true;

    let themes = {
      'light': { title: i18n.t('theme-light') },
      'dark': { title: i18n.t('theme-dark') },
      'amoled': { title: i18n.t('theme-amoled') },
    };

    let theme = Colors.Themes[this.state.theme];

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      >

        {
          this.state.modals.map(modal => {
            return modal;
          })
        }

        <ScrollView>
          <SettingsSectionHeader
            title={ i18n.t('section-general') }
          />

          <SelectionSettingItem
            title={ i18n.t('theme') }
            icon={ 'eye' }
            modalTitle={ i18n.t('theme') }
            options={ themes }
            selected={ this.state.theme }
            onChange={ theme => this.onThemeChanged(theme) }
            showUpModal={ this.addModal }
            closeModal={ this.removeModal }
          />

          <TimeRangeSettingItem
            title={ i18n.t('visible-time-range') }
            icon={ 'clock' }
            modalTitle={ i18n.t('visible-hours') }
            showUpModal={ this.addModal }
            closeModal={ this.removeModal }
            startHour={ 10 }
            endHour={ 20 }
          />

          <WeekdaysSettingItem
            title={ i18n.t('visible-days' )}
            icon={ 'calendar-multiselect' }
            touchable={ false }
            activeDays={ State.visibleDays }
            onChange={ days => this.onVisibleDaysChanged(days) }
          />

          <SettingItem
            title={ i18n.t('notifications') }
            icon={ 'bell' }
          />

          <SettingsSectionHeader
            title={ i18n.t('section-app-info') }
          />

          <SettingItem
            title={ Consts.APP_VERSION }
            icon={ 'developer-board' }
          />
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
