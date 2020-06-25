const messages = {
  fr: {
    'global.error': "Une erreur s'est produite",
    'global.saved': 'Les changements ont été enregistrés',
  },
  en: {
    'global.error': 'An error occurred',
    'global.saved': 'Changes saved',
  },
};

const language = window.navigator.language.slice(0, 2);

export default {
  trans: (key: string): string => {
    if (messages[language] && messages[language][key]) {
      return messages[language][key];
    }
    if (messages.en[key]) {
      return messages.en[key];
    }

    return key;
  },
};
