import * as WebsiteJsToolbox from 'website-js-toolbox';
const { SeeMore, FlashMessages } = WebsiteJsToolbox;

export default {
  init: (): void => {
    document.querySelector('[data-demo-seemore]').addEventListener('click', (e) => {
      e.preventDefault();

      SeeMore.apply(document.querySelector('[data-demo-seemore-container]'), () => {
        FlashMessages.success('Callback when new elments added!');
      });
    });
    SeeMore.attachToDOM();
  },
};
