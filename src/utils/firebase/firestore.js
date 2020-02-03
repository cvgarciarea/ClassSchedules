import firebase from 'react-native-firebase';

export default class Firestore {

  static firestore = null;
  static testRef = null;

  static init() {
    Firestore.firestore = firebase.firestore();
    Firestore.testRef = Firestore.firestore.collection('test-collection');
  }

  static getTestValue() {
    return new Promise(resolve => {
      Firestore.testRef
      .where('id', '==', 1)
      .limit(1)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data();
          console.log(doc.id, data);

          resolve(data);
        });
      })
    })
  }
}
