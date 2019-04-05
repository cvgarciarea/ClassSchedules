import React from 'react';
import {
  View,
} from 'react-native';

import Utils from '../utils/utils';

class Spacer extends React.Component {

  render() {
    let vertical = Utils.emptyString(this.props.orientation) || this.props.orientation === 'vertical';

    return (
      <View style={
        vertical ?
          { paddingBottom: this.props.size }
        :
          { paddingRight: this.props.size }} />
    )
  }
}

export class Spacer10 extends React.Component {

  render() {
    return <Spacer size={ 10 } orientation={ this.props.orientation } />
  }
}

export class Spacer20 extends React.Component {

  render() {
    return <Spacer size={ 20 } orientation={ this.props.orientation } />
  }
}

export class Spacer30 extends React.Component {

  render() {
    return <Spacer size={ 30 } orientation={ this.props.orientation } />
  }
}

export class Spacer40 extends React.Component {

  render() {
    return <Spacer size={ 40 } orientation={ this.props.orientation } />
  }
}

export class Spacer50 extends React.Component {

  render() {
    return <Spacer size={ 50 } orientation={ this.props.orientation } />
  }
}

export class FlexSpacer extends React.Component {

  render() {
    return <View style={[ { flex: 1 }, this.props.style ]} />
  }
}