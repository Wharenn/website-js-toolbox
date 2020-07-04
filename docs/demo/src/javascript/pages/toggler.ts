import * as WebsiteJsToolbox from 'website-js-toolbox';

const { Toggler } = WebsiteJsToolbox;

export default {
  init: (): void => {
    Toggler.attachToDOM();
  },
};
