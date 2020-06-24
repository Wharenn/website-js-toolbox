import tingle from 'tingle.js';
import Loader from './Loader';
import asyncSubmit, { FormResponse } from './AsyncSubmit';
import '../../node_modules/tingle.js/dist/tingle.min.css';
import './modal.scss';
import FlashMessages from './FlashMessages';

interface ModalObject {
  setContent: CallableFunction;
  getContent: CallableFunction;
  open: CallableFunction;
  close: CallableFunction;
  addFooterBtn: CallableFunction;
}

/**
 * Set the loading state of a modal
 */
const setLoading = (modal: ModalObject, loadingState: boolean): void => {
  const content = modal.getContent();

  if (loadingState === false) {
    // We leave loading state, removing overlay and enable buttons again
    content.querySelectorAll('.Modal__Loading').forEach((el: HTMLElement) => el.remove());
    document.querySelectorAll('.tingle-modal-box__footer button').forEach((button: HTMLElement) => {
      button.removeAttribute('disabled');
    });
  } else {
    // We enter loading state, set overlay and disable footer buttons (prevent multi submit)
    const loadingElement = document.createElement('div');
    loadingElement.classList.add('Modal__Loading');
    loadingElement.innerHTML = Loader.getLoaderContent();
    content.append(loadingElement);

    document.querySelectorAll('.tingle-modal-box__footer button').forEach((button: HTMLElement) => {
      button.setAttribute('disabled', 'disabled');
    });
  }
};

const createModal = (onOpen?: CallableFunction): ModalObject => {
  return new tingle.modal({
    footer: true,
    stickyFooter: true,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: 'Close',
    cssClass: ['Modal'],
    onOpen,
  });
};

const closeModal = (modal: ModalObject) => {
  modal.close();
};

/**
 * Submit the form contained in a modal, if any
 */
const submitModal = (modal: ModalObject, onFormSuccess?: CallableFunction, onFormError?: CallableFunction) => {
  const content = modal.getContent();
  const form = content.querySelector('form') as HTMLFormElement;

  if (!form) {
    return;
  }

  setLoading(modal, true);
  asyncSubmit(
    form,
    (response: FormResponse) => {
      if (response && response.message) {
        FlashMessages.success(response.message);
      }

      setLoading(modal, false);

      if (onFormSuccess) {
        onFormSuccess(modal);
      }

      modal.close();
    },
    (response: FormResponse) => {
      if (response && response.message) {
        FlashMessages.error(response.message);
      }

      setLoading(modal, false);

      if (onFormError) {
        onFormError(modal);
      }
    },
  );
};

const hideElement = (element: HTMLElement) => {
  element.style.position = 'absolute';
  element.style.left = '-9999px';
};

/**
 * Open a modal containing the element targeted by the given id
 */
const openSelfModal = (elementId: string, onOpen?: CallableFunction) => {
  const modal = createModal(onOpen);
  const contentElement = document.getElementById(elementId);
  const content = contentElement ? contentElement.innerHTML : `Could not found element with id "${elementId}"`;

  modal.setContent(content);
  modal.open();
};

/**
 * Open a modal containing the result of an url, with optional callbacks
 */
const openRemoteModal = (href: string, onOpen?: CallableFunction, onFormSuccess?: CallableFunction, onFormError?: CallableFunction) => {
  const modal = createModal(onOpen);
  setLoading(modal, true);
  modal.open();

  fetch(href, { headers: new Headers({ 'X-Requested-With': 'XMLHttpRequest' }) })
    .then((response) => response.text())
    .then((response) => {
      setLoading(modal, false);
      modal.setContent(response);
      const content = modal.getContent();
      content.querySelectorAll('[data-modal-button]').forEach((button: HTMLElement) => {
        const label = button.dataset.modalButtonLabel;
        const isDanger = button.dataset.modalButtonDanger;

        let classes = 'tingle-btn';
        if (button.dataset.modalSubmit !== undefined) {
          classes += ` tingle-btn--pull-right ${isDanger !== undefined ? 'tingle-btn--danger' : 'tingle-btn--primary'}`;
        } else {
          classes += ' tingle-btn--default';
        }

        modal.addFooterBtn(label, classes, () => {
          if (button.dataset.modalClose !== undefined) {
            closeModal(modal);
          } else if (button.dataset.modalSubmit !== undefined) {
            submitModal(modal, onFormSuccess, onFormError);
          }
        });
        hideElement(button);
      });
    });
};

const Modal = {
  open: (url: string, onOpen?: CallableFunction, onFormSuccess?: CallableFunction, onFormError?: CallableFunction): void => {
    openRemoteModal(url, onOpen, onFormSuccess, onFormError);
  },
  openElement: (elementId: string, onOpen?: CallableFunction): void => openSelfModal(elementId, onOpen),

  attachToDOM: (): void => {
    document.querySelectorAll<HTMLElement>('[data-modal-open]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();

        const elementId = el.dataset.modalContentElementId;
        const href = el.getAttribute('href');

        if (elementId) {
          openSelfModal(elementId);
        } else if (href) {
          openRemoteModal(href);
        }
      });
    });
  },
};

export default Modal;
