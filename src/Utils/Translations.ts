const messages = {
  fr: {
    'global.error': "Une erreur s'est produite",
    'global.saved': 'Les changements ont été enregistrés',
    'global.close': 'Fermer',
    'global.validate': 'Valider',
    'global.seeNextResults': 'Afficher la suite',
    'searchModal.select': 'Sélectionner',
    'searchModal.results': 'Résultats',
    'searchModal.addToSelection': 'Ajouter',
    'searchModal.startSearching': 'Effectuez une recherche pour démarrer.',
    'searchModal.selectedItems': 'Eléments sélectionnés',
  },
  en: {
    'global.error': 'An error occurred',
    'global.saved': 'Changes saved',
    'global.close': 'Close',
    'global.validate': 'Validate',
    'global.seeNextResults': 'See next results',
    'searchModal.select': 'Select',
    'searchModal.results': 'Results',
    'searchModal.addToSelection': 'Add',
    'searchModal.startSearching': 'Search to start.',
    'searchModal.selectedItems': 'Selected Items',
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
