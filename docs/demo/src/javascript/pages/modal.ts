import * as WebsiteJsToolbox from 'website-js-toolbox';

const { Modal, FlashMessages } = WebsiteJsToolbox;

export default {
  init: (): void => {
    document.querySelector('[data-demo-modal-self=open]').addEventListener('click', () => {
      const options = {
        onOpen: () => {
          FlashMessages.success('Custom callback when opened');
        },
      };

      Modal.openElement('modal-content', options);
    });
    document.querySelector('[data-demo-modal-remote=open]').addEventListener('click', () => {
      const options = {
        onFormSuccess: () => {
          FlashMessages.success('Custom callback when opened');
        },
        onFormError: () => {
          FlashMessages.success('Custom callback when success (and there is one for error too)');
        },
      };

      Modal.open('/src/resources/fixtures/modalWithForm.html', options);
    });

    Modal.attachToDOM();
  },
};
