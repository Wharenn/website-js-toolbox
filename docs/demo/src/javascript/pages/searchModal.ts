import * as WebsiteJsToolbox from 'website-js-toolbox';

const { SearchModal, FlashMessages } = WebsiteJsToolbox;

export default {
  init: (): void => {
    const resultsContainer = document.querySelector('[data-demo-searchmodal-results]');
    document.querySelector('[data-demo-searchmodal]').addEventListener('click', (e) => {
      e.preventDefault();

      const onSearchFormLoaded = () => {
        FlashMessages.success('Search form loaded, input focused!');
      };

      const link = e.currentTarget as HTMLElement;
      const options = {
        onSearchFormLoaded,
      };
      SearchModal.open(link.getAttribute('href'), options, (payload: Record<string, unknown>) => {
        resultsContainer.innerHTML = JSON.stringify(payload);
      });
    });

    document.querySelector('[data-demo-searchmodal-multiple]').addEventListener('click', (e) => {
      e.preventDefault();

      const onSearchFormLoaded = () => {
        FlashMessages.success('Search form loaded, input focused!');
      };

      const link = e.currentTarget as HTMLElement;
      const options = {
        onSearchFormLoaded,
        isMultiple: true,
      };
      SearchModal.open(link.getAttribute('href'), options, (payload: Record<string, unknown>) => {
        resultsContainer.innerHTML = JSON.stringify(payload);
      });
    });

    document.querySelector('[data-demo-searchmodal-initial]').addEventListener('click', (e) => {
      e.preventDefault();

      const onSearchFormLoaded = () => {
        FlashMessages.success('Search form loaded, loading initial data!');
      };

      const link = e.currentTarget as HTMLElement;
      const options = {
        onSearchFormLoaded,
        doDisplayInitialData: true,
      };
      SearchModal.open(link.getAttribute('href'), options, (payload: Record<string, unknown>) => {
        resultsContainer.innerHTML = JSON.stringify(payload);
      });
    });
  },
};
