import tingle from 'tingle.js';
import Loader from '../../Utils/Loader';
import '../../../node_modules/tingle.js/dist/tingle.min.css';
import './Modal.scss';
import asyncSubmit, { FormResponse } from '../../Utils/AsyncSubmit';
import { hideElement } from '../../Utils/Hide';
import FlashMessages from '../FlashMessages';
import Translations from '../../Utils/Translations';

interface ModalObject {
  setContent: CallableFunction;
  getContent: CallableFunction;
  open: CallableFunction;
  close: CallableFunction;
  addFooterBtn: CallableFunction;
}

interface ModalOptions {
  isLarge?: boolean;
  hideFooter?: boolean;
  onOpen?: CallableFunction;
  onFormSuccess?: CallableFunction;
  onFormError?: CallableFunction;
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

const createModal = (options: ModalOptions = {}): ModalObject => {
  const hasFooter = options.hideFooter !== true;
  const cssClass = ['Modal'];
  if (options.isLarge) {
    cssClass.push('Modal--large');
  }
  if (hasFooter) {
    cssClass.push('Modal--withFooter');
  }

  const modal = new tingle.modal({
    footer: hasFooter || false,
    stickyFooter: hasFooter || false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: Translations.trans('global.close'),
    cssClass,
    onOpen: options.onOpen,
    onClose: () => {
      modal.destroy();
    },
  });

  return modal;
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

/**
 * Open a modal containing the element targeted by the given id
 */
const openSelfModal = (elementId: string, options: ModalOptions = {}): ModalObject => {
  const modal = createModal(options);
  const contentElement = document.getElementById(elementId);
  const content = contentElement ? contentElement.innerHTML : `Could not found element with id "${elementId}"`;

  modal.setContent(content);
  modal.open();

  return modal;
};

/**
 * Open a modal containing the element targeted by the given id
 */
const openEmptyModal = (options: ModalOptions = {}): ModalObject => {
  const modal = createModal(options);
  modal.open();

  return modal;
};

/**
 * Open a modal containing the result of an url, with optional callbacks
 */
const openRemoteModal = (href: string, options: ModalOptions = {}): ModalObject => {
  const modal = createModal(options);
  setLoading(modal, true);
  modal.open();

  fetch(href, { headers: new Headers({ 'X-Requested-With': 'XMLHttpRequest' }) })
    .then((response) => response.text())
    .then((response) => {
      setLoading(modal, false);
      modal.setContent(response);
      const content: HTMLElement = modal.getContent();

      // Prevent classic submit, plug instead the async submit
      content.querySelectorAll('form').forEach((element) => {
        element.addEventListener('submit', (e) => {
          e.preventDefault();

          submitModal(modal, options.onFormSuccess, options.onFormError);
        });
      });

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
            submitModal(modal, options.onFormSuccess, options.onFormError);
          }
        });
        hideElement(button);
      });
    });

  return modal;
};

const Modal = {
  openElement: (elementId: string, options: ModalOptions = {}): ModalObject => openSelfModal(elementId, options),
  openEmpty: (options: ModalOptions = {}): ModalObject => openEmptyModal(options),
  open: (url: string, options: ModalOptions = {}): ModalObject => {
    return openRemoteModal(url, options);
  },

  setContent: (modal: ModalObject, content: string): void => modal.setContent(content),
  setLoading: (modal: ModalObject, loadingState: boolean): void => setLoading(modal, loadingState),

  attachToDOM: (element?: HTMLElement): void => {
    (element || document).querySelectorAll<HTMLElement>('[data-modal-open]').forEach((el) => {
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
