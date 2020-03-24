import firebase from 'react-native-firebase';

import config from './config';
import Firestore from './firestore';
import Storage from './storage';
import Notifications from './notifications';

export let firebaseApp = null;

export default function initFirebase(i18n) {
  if (firebase.apps.length === 0) {
    firebaseApp = firebase.initializeApp(config);
  }

  // Todo lo que viene a continuación debería hacerlo dentro del if?
  Firestore.init();
  Storage.init();
  Notifications.init(i18n);
}

export {
  Firestore,
  Storage,
  Notifications,
};
