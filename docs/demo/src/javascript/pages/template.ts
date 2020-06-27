import * as WebsiteJsToolbox from 'website-js-toolbox';
import { template } from '@babel/core';
const { Template, FlashMessages } = WebsiteJsToolbox;

const data = {
  name: 'Foo',
  description: 'Bar description',
};

export default {
  init: (): void => {
    const templateElement = document.querySelector('[data-demo-template-template]');
    const anchorElement = document.querySelector('[data-demo-template-anchor]');

    document.querySelector('[data-demo-template-child]').addEventListener('click', (e) => {
      e.preventDefault();

      Template.apply(templateElement, data, anchorElement, 'child', (newNodes: DocumentFragment) => {
        FlashMessages.success('Callback when templated added!');
        console.log(newNodes);
      });
    });

    document.querySelector('[data-demo-template-before]').addEventListener('click', (e) => {
      e.preventDefault();

      Template.apply(templateElement, data, anchorElement, 'before', (newNodes: DocumentFragment) => {
        FlashMessages.success('Callback when templated added!');
        console.log(newNodes);
      });
    });

    document.querySelector('[data-demo-template-after]').addEventListener('click', (e) => {
      e.preventDefault();

      Template.apply(templateElement, data, anchorElement, 'after', (newNodes: DocumentFragment) => {
        FlashMessages.success('Callback when templated added!');
        console.log(newNodes);
      });
    });

    Template.attachToDOM();
  },
};
