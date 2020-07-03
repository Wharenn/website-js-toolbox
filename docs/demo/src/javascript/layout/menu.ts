import FlashMessages from '../pages/flashMessages';
import Logger from '../pages/logger';
import Dialogs from '../pages/dialogs';
import Modal from '../pages/modal';
import SearchModal from '../pages/searchModal';
import SeeMore from '../pages/seeMore';
import Template from '../pages/template';
import HtmlElementFiller from '../pages/htmlElementFiller';

interface Page {
  id: string;
  title: string;
  onLoaded: CallableFunction;
}

const pages = [
  {
    id: 'flashMessages',
    title: 'Flash Messages',
    onLoaded: () => FlashMessages.init(),
  },
  {
    id: 'logger',
    title: 'Logger',
    onLoaded: () => Logger.init(),
  },
  {
    id: 'dialogs',
    title: 'Dialogs & Alerts',
    onLoaded: () => Dialogs.init(),
  },
  {
    id: 'modal',
    title: 'Modal',
    onLoaded: () => Modal.init(),
  },
  {
    id: 'searchModal',
    title: 'Search Modal',
    onLoaded: () => SearchModal.init(),
  },
  {
    id: 'template',
    title: 'Template',
    onLoaded: () => Template.init(),
  },
  {
    id: 'seeMore',
    title: 'See More',
    onLoaded: () => SeeMore.init(),
  },
  {
    id: 'htmlElementFiller',
    title: 'HTMLElement Filler',
    onLoaded: () => HtmlElementFiller.init(),
  },
];

const loadPage = (page: Page, container: Element) => {
  document.querySelectorAll(`[data-page-id]`).forEach((link) => {
    link.classList.remove('active');
  });

  const activeLink = document.querySelector<HTMLElement>(`[data-page-id=${page.id}]`);
  activeLink.classList.add('active');

  fetch(`../src/resources/${page.id}.html`, { headers: new Headers({ 'X-Requested-With': 'XMLHttpRequest' }) })
    .then((response) => response.text())
    .then((response) => {
      container.innerHTML = response;
      page.onLoaded();
    });
};

export default {
  render: (): void => {
    const menuContainer = document.getElementsByClassName('page-list')[0];
    const contentContainer = document.getElementsByClassName('Demo__Content')[0];
    const anchor = document.URL.split('#').length > 1 ? document.URL.split('#')[1] : null;

    pages.forEach((page) => {
      const link = document.createElement('a');
      link.innerHTML = page.title;
      link.href = `#${page.id}`;
      link.setAttribute('data-page-id', page.id);
      link.addEventListener('click', () => {
        loadPage(page, contentContainer);
      });

      const li = document.createElement('li');
      li.append(link);
      menuContainer.append(li);
    });

    if (anchor) {
      const defaultPages = pages.filter((page) => {
        return page.id === anchor;
      });

      if (defaultPages.length >= 0) {
        loadPage(defaultPages[0], contentContainer);
      }
    }
  },
};
