import * as WebsiteJsToolbox from 'website-js-toolbox';

const { HTMLElementFiller } = WebsiteJsToolbox;

export default {
  init: (): void => {
    const data = {
      foo: 'This has been updated!',
      bar: {
        link: '/foo/bar',
      },
    };

    document.querySelector('[data-demo-filler]').addEventListener('click', (e) => {
      e.preventDefault();

      document.querySelectorAll('[data-filler]').forEach((element) => {
        HTMLElementFiller.fill(element, data);
      });
    });
  },
};
