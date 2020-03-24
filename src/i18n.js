import RNLanguages from 'react-native-languages';
import i18n from 'i18n-js';

import en from './translations/en.json';
import es from './translations/es.json';

import State from './utils/state';
import Storage from './utils/storage';

i18n.locale = RNLanguages.language;
i18n.fallbacks = true;
i18n.translations = {
  en,
  es,
};

i18n.supportedLanguages = {
  en: 'English',
  es: 'Español',
};

Storage.getValue(Storage.Keys.language, 'en')
.then(language => {
  i18n.locale = language;
});

State.subscribeTo('language', language => {
  let supported = Object.keys(i18n.supportedLanguages);

  if (supported.includes(language)) {
    i18n.locale = language;
  }
});

export default i18n;
