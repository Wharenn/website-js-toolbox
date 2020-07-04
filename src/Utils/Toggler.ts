import { showElement, hideElement } from './Hide';

const onOpenLinkClick = (e: Event) => {
  e.preventDefault();

  const link = e.currentTarget as HTMLElement;
  const elementId = link.dataset.toggleOpen;
  const elements = document.querySelectorAll(`[data-toggle-id=${elementId}`);

  elements.forEach((el: HTMLElement) => showElement(el));
};

const onCloseLinkClick = (e: Event) => {
  e.preventDefault();

  const link = e.currentTarget as HTMLElement;
  const elementId = link.dataset.toggleClose;
  const elements = document.querySelectorAll(`[data-toggle-id=${elementId}`);

  elements.forEach((el: HTMLElement) => hideElement(el));
};

const Toggler = {
  attachToDOM: (element?: HTMLElement): void => {
    const target = element || document;

    // Elements which must be hidden by default
    target.querySelectorAll('[data-toggle-closed]').forEach((hiddenElement: HTMLElement) => {
      hideElement(hiddenElement);
    });

    // Links to show something
    target.querySelectorAll('[data-toggle-open]').forEach((link: HTMLElement) => {
      link.addEventListener('click', onOpenLinkClick);
    });

    // Links to hide something
    target.querySelectorAll('[data-toggle-close]').forEach((link: HTMLElement) => {
      link.addEventListener('click', onCloseLinkClick);
    });
  },
};

export default Toggler;
