import * as WebsiteJsToolbox from 'website-js-toolbox';

const { SearchModal } = WebsiteJsToolbox;

export default {
  init: (): void => {
    document.querySelector('[data-demo-search-modal]').addEventListener('click', (e) => {
      e.preventDefault();

      const link = e.currentTarget as HTMLElement;
      SearchModal.open(link.getAttribute('href'));
    });
  },
};
