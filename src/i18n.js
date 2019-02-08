import RNLanguages from 'react-native-languages';
import i18n from 'i18n-js';

import en from './translations/en.json';
import es from './translations/es.json';

/*
let utils = new Utils();
utils.retrieveData(utils.StoreKeys.language, defaultValue=RNLanguages.language)
.then((value) => {
  i18n.locale = value;
})
*/

i18n.locale = RNLanguages.language
i18n.fallbacks = true;
i18n.translations = { en, es };

export default i18n;