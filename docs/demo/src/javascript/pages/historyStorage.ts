import * as WebsiteJsToolbox from 'website-js-toolbox';

const { HistoryStorage } = WebsiteJsToolbox;

export default {
  init: (): void => {
    ['foo', 'bar'].forEach((value) => {
      document.querySelector(`[data-demo-history-${value}-add]`).addEventListener('click', (e) => {
        e.preventDefault();

        const contentElement = document.querySelector(`[data-demo-history-${value}-input]`) as HTMLInputElement;

        HistoryStorage.add(value, { id: contentElement.value, name: contentElement.value });
        contentElement.value = '';
      });

      document.querySelector(`[data-demo-history-${value}-print]`).addEventListener('click', (e) => {
        e.preventDefault();

        const items = HistoryStorage.get(value);
        document.querySelector(`[data-demo-history-${value}-display]`).innerHTML = JSON.stringify(items);
      });

      document.querySelector(`[data-demo-history-${value}-clear]`).addEventListener('click', (e) => {
        e.preventDefault();

        HistoryStorage.clear(value);
      });
    });
  },
};
