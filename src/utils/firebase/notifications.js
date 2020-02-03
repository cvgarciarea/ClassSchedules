import firebase from 'react-native-firebase';
import moment from 'moment';

import i18n from '../../i18n';
import Utils from '../utils';
import InternalStorage from '../storage';  // No confundir con firebase storage

export default class Notifications {

  static channels = {
    todayClasses: 'today-classes',
  };

  static todayClassesChannel = null;
  static listener = null;

  static init() {
    Notifications.todayClassesChannel = new firebase.notifications.Android.Channel(
      Notifications.channels.todayClasses,
      i18n.t('notification-channel-today-classes-name'),
      firebase.notifications.Android.Importance.Default,
    )
    .setDescription(i18n.t('notification-channel-today-classes-description'));

    firebase.notifications().android.createChannel(Notifications.todayClassesChannel);
  }

  static async requestPermission() {
    const enabled = await firebase.messaging().hasPermission();

    if (enabled) {
      Notifications._createListener();
    } else {
      firebase.messaging().requestPermission()
      .then(response => {
        console.log('RESPONSE SOLICITUD DE PERMISO DE NOTIFICACIONES', response);
        Notifications._createListener();
      })
      .catch(error => console.log('ERROR AL PEDIR PERMISO', error));
    }
  }

  static _createListener() {
    Notifications.listener = firebase
      .notifications()
      .onNotification(async notification => {
        console.log('onNotification', notification);
        await firebase.notifications().displayNotification(notification);
      });
  }

  static buildNotification({ id, title, body }) {
    const notification = new firebase.notifications.Notification()
      .setNotificationId(id)
      .setTitle(title)
      .setBody(body)
      .android.setPriority(firebase.notifications.Android.Priority.Default)
      .android.setChannelId(Notifications.channels.todayClasses)
      .android.setAutoCancel(true);
    
    return notification;
  }

  static deleteReminder(notificationID) {
    firebase.notifications().cancelNotification(notificationID);
  }

  static async createReminder() {
    let now = moment();
    now.add(2, 'seconds');

    const {
      dailyReminderIDs: dailyKey,
      notificationIDs: notificationIDsKey,
    } = InternalStorage.Keys;

    let dailyReminders = JSON.parse(await InternalStorage.getValue(dailyKey, '{}'));
    let notificationIDs = JSON.parse(await InternalStorage.getValue(notificationIDsKey, '[]'));

    // Si había una notificación para ese día hay que borrarla
    const notificationKey = `day-${ now.day() }`;

    if (Utils.isDefined(dailyReminders[notificationKey])) {
      _id = dailyReminders[notificationKey];
      Notifications.deleteReminder(_id);
      notificationIDs.removeAll(_id);
    }

    // Genero un id único para esta notificación
    let notificationID;

    do {
      notificationID = Utils.uuidv4();
    } while (notificationIDs.includes(notificationID));

    // Guardo el id generado para la notificación que estoy por programar
    dailyReminders[notificationKey] = notificationID;
    notificationIDs.push(notificationID);

    InternalStorage.storeMultipleValues({
      [dailyKey]: JSON.stringify(dailyReminders),
      [notificationIDsKey]: JSON.stringify(notificationIDs),
    });

    // Programo la notificación
    let notificationData = {
      id: notificationID,
      title: 'titulo',
      body: 'body',
    };

    const notification = Notifications.buildNotification(notificationData);

    firebase.notifications()
    .scheduleNotification(notification, {
      fireDate: now.toDate().getTime(),
      exact: true,
      repeatInterval: 'week',
    });
  }
}
