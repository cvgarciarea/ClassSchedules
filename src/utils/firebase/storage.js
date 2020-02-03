import firebase from 'react-native-firebase';

export default class Storage {

  static storage = null;

  static init() {
    Storage.storage = firebase.storage().ref();
  }
}
