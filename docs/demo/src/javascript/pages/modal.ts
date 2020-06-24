import * as WebsiteJsToolbox from 'website-js-toolbox';

const { Modal, FlashMessages } = WebsiteJsToolbox;

export default {
  init: (): void => {
    document.querySelector('[data-demo-modal-self=open]').addEventListener('click', () => {
      Modal.openElement('modal-content', () => {
        FlashMessages.success('Custom callback when opened');
      });
    });
    document.querySelector('[data-demo-modal-remote=open]').addEventListener('click', () => {
      Modal.open(
        '/src/resources/fixtures/modalWithForm.html',
        () => {
          FlashMessages.success('Custom callback when opened');
        },
        () => {
          FlashMessages.success('Custom callback when success (and there is one for error too)');
        },
      );
    });

    Modal.attachToDOM();
  },
};
