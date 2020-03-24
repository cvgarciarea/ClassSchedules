import {
  Platform,
} from 'react-native';
import firebase from 'react-native-firebase';
import moment from 'moment';

// import i18n from '../../i18n';
import Consts from '../consts';
import Utils from '../utils';
import InternalStorage from '../storage';  // No confundir con firebase storage

// FIXME: Encontrar una mejor manera de utilizar i18n sin tener que
//        importarlo, preferiblemente sin tener que pasarlo como
//        parámetro como hasta ahora.
let i18n = null;

export default class Notifications {

  static channels = {
    todayClasses: 'today-classes',
  };

  static todayClassesChannel = null;
  static listener = null;

  static init(_i18n) {
    i18n = _i18n;

    if (Platform.OS === 'android') {
      Notifications.todayClassesChannel = new firebase.notifications.Android.Channel(
        Notifications.channels.todayClasses,
        i18n.t('notification-channel-today-classes-name'),
        firebase.notifications.Android.Importance.Default,
      )
      .setDescription(i18n.t('notification-channel-today-classes-description'));

      firebase.notifications()
      .android
      .createChannel(Notifications.todayClassesChannel);
    }
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

  static buildNotification({ id, title, body, largeBody }) {
    const notification = new firebase.notifications.Notification()
      .setNotificationId(id)
      .setTitle(title)
      .setBody(body)
      .android.setBigText(largeBody)
      .android.setPriority(firebase.notifications.Android.Priority.Default)
      .android.setChannelId(Notifications.channels.todayClasses)
      .android.setAutoCancel(true);
    
    return notification;
  }

  static async cancelNotification(notificationID) {
    await firebase.notifications().cancelNotification(notificationID);
  }

  /**
   * Borra todas las notificaciones de los recordatorios diarios sobre las
   * clases del día.
   */
  static async clearDailyClassesNotifications() {
    const {
      dailyClassesNotificationsIDs: dailyKey,
      notificationIDs: notificationIDsKey,
    } = InternalStorage.Keys;

    let dailyNotifications = JSON.parse(await InternalStorage.getValue(dailyKey, '{}'));
    let notificationIDs = JSON.parse(await InternalStorage.getValue(notificationIDsKey, '[]'));

    for (let i=Consts.Days.SUNDAY; i<Consts.Days.SATURDAY; i++) {
      let key = `day-${ i }`;
      let id = dailyNotifications[key];

      if (Utils.isDefined(id)) {
        await Notifications.cancelNotification(id);
        delete dailyNotifications[id];
        notificationIDs = notificationIDs.removeAll(id);
      }
    }

    await InternalStorage.storeMultipleValues({
      [dailyKey]: dailyNotifications,
      [notificationIDsKey]: notificationIDs,
    });
  }

  /**
   * Sobreescribe los recordatorios diarios sobre las materias del día a día
   * con la información guardada actualmente sobre las clases.
   */
  static async buildDailyClassesNotifications() {
    await Notifications.clearDailyClassesNotifications();

    /**
     * DISCLAIMER: Leerlo del disco me sirve para no crear un 'require cycle'
     * al importar State.
     */
    const dailySubjectsNotificationTime = await InternalStorage.getValue(InternalStorage.Keys.dailySubjectsNotificationTime, '08:00');
    let _moment = moment(dailySubjectsNotificationTime, 'HH:mm');
    const hour = _moment.get('hour');
    const minute = _moment.get('minute');

    const {
      schedules: schedulesKey,
      dailyClassesNotificationsIDs: dailyKey,
      notificationIDs: notificationIDsKey,
    } = InternalStorage.Keys;

    let dailyNotificationIDs = {};
    let subjects = await InternalStorage.getValue(schedulesKey, '{}');
    let notificationIDs = await InternalStorage.getValue(notificationIDsKey, '[]');

    subjects = JSON.parse(subjects);
    notificationIDs = JSON.parse(notificationIDs);

    let classes = {
      [Consts.Days.SUNDAY]:    [],
      [Consts.Days.MONDAY]:    [],
      [Consts.Days.TUESDAY]:   [],
      [Consts.Days.WEDNESDAY]: [],
      [Consts.Days.THURSDAY]:  [],
      [Consts.Days.FRIDAY]:    [],
      [Consts.Days.SATURDAY]:  [],
    };

    // Leo las clases programadas
    for (let subjectID in subjects) {
      let subject = subjects[subjectID];

      for (let _class of subject.schedules) {
        classes[_class.startDay].push({
          name: _class.name,
          startTime: _class.startTime,
          description: _class.description,
        });
      }
    }

    for (let day in classes) {
      if (classes[day].length > 0) {
        // Ordeno por hora de inicio
        classes[day] = classes[day].sort((a, b) => {
          return moment(a.startTime, 'HH:mm').diff(moment(b.startTime, 'HH:mm'));
        });

        // Creo el contenido de la notificación
        let lines = [];
        for (let _class of classes[day]) {
          lines.push(`${ _class.startTime } ${ _class.name } ${ _class.description }`)
        }

        // Genero un id único para esta notificación
        let notificationID;

        do {
          notificationID = Utils.uuidv4();
        } while (notificationIDs.includes(notificationID));

        dailyNotificationIDs[`day-${ day }`] = notificationID;
        notificationIDs.push(notificationID);

        // Construyo la notificación en sí
        let notification = Notifications.buildNotification({
          id: notificationID,
          title: Utils.getDayName(day),
          body: lines.join(' '),
          largeBody: lines.join('\n'),
        });

        // Programo la notificación para que se lance cada semana
        let now = moment();
        let fireDate = moment().weekday(
          day === Consts.Days.SUNDAY
          ? 7    // Los domingos son 7, en mi notación valen 0
          : day  // Cualquier otro día de la semana coincide
        );

        fireDate.set('hour', hour);
        fireDate.set('minute', minute);
        fireDate.set('second', '00');

        if (now.diff(fireDate) > 0) {
          // Esta fecha ya pasó, agregarle 7 días para que sea el mismo día de
          // la semana (weekday) pero de la semana que viene.
          fireDate.add(7, 'days');
        }

        firebase.notifications()
        .scheduleNotification(notification, {
          fireDate: fireDate.toDate().getTime(),
          exact: true,
          repeatInterval: 'week',
        });
      }
    }

    // Guardo los nuevos IDs de notificaciones
    InternalStorage.storeMultipleValues({
      [notificationIDsKey]: notificationIDs,
      [dailyKey]: dailyNotificationIDs,
    });
  }

  static async createReminder() {
    let now = moment();
    now.add(2, 'seconds');

    const {
      dailyClassesNotificationsIDs: dailyKey,
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

    let lines = [
      'line1',
      'line2',
      'line3',
      'line4',
      'line5',
      'line6',
      'line7',
      'line8',
      'line9',
      'line10',
      'line11',
      'line12',
      'line13',
      'line14',
      'line15',
    ];

    // Programo la notificación
    let notificationData = {
      id: notificationID,
      title: 'titulo',
      body: lines.join(' '),
      largeBody: lines.join('\n'),
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
