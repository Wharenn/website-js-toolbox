import Handlebars from 'handlebars';
import Logger from '../../Utils/Logger';
import Loader from '../../Utils/Loader';
import { hideElement, showElement } from '../../Utils/Hide';
import './SeeMore.scss';
import FlashMessages from '../FlashMessages';
import Translations from '../../Utils/Translations';
import { SeeMore } from '../../index';

const insertItems = (
  container: HTMLElement,
  beforeElement: HTMLElement,
  data: Record<string, unknown>,
  template: CallableFunction,
  onUpdate?: CallableFunction,
): void => {
  const newNodes = document.createRange().createContextualFragment(template(data));
  container.insertBefore(newNodes, beforeElement);

  if (onUpdate) {
    onUpdate(newNodes);
  }
};

export default {
  apply: (container: HTMLElement, onUpdate?: CallableFunction): void => {
    const link = container.querySelector('[data-seemore-link]') as HTMLElement;
    const templateContainer = container.querySelector('[data-seemore-template]');
    const bottomLine = container.querySelector('[data-seemore-bottom]') as HTMLElement;
    const initialItems = container.querySelector('[data-seemore-initial-items]');

    if (!link || !templateContainer || !bottomLine) {
      Logger.warn('Missing some see more required components.');
      return;
    }

    const template = Handlebars.compile(templateContainer.innerHTML);

    if (initialItems) {
      try {
        const items = JSON.parse(initialItems.innerHTML);
        insertItems(container, bottomLine, items, template, onUpdate);
      } catch (error) {
        Logger.warn('Failed to parse initial see more items.');
      }
    }

    let isFetching = false;
    const loader = document.createElement('div');
    loader.classList.add('SeeMore__Loader');
    loader.innerHTML = Loader.getThreeDots();

    link.addEventListener('click', (e) => {
      e.preventDefault();

      if (isFetching) {
        return;
      }

      isFetching = true;
      hideElement(link);
      const currentHref = link.getAttribute('href');

      // Display loader
      container.insertBefore(loader, bottomLine);

      fetch(currentHref, { headers: new Headers({ 'X-Requested-With': 'XMLHttpRequest' }) })
        .then((response) => response.json())
        .then((response) => {
          isFetching = false;
          loader.remove();

          if (!response.data) {
            return;
          }

          // Insert new content
          insertItems(container, bottomLine, response.data, template, onUpdate);

          if (response.data.nextLink) {
            // There is still content, update link
            link.setAttribute('href', response.data.nextLink);
            showElement(link);
          } else {
            // No next link, end of results, hide link
            link.remove();
          }
        })
        .catch(() => {
          loader.remove();
          isFetching = false;

          FlashMessages.error(Translations.trans('global.error'));
        });
    });
  },

  attachToDOM: (element?: HTMLElement): void => {
    (element || document).querySelectorAll<HTMLElement>('[data-seemore]').forEach((container) => SeeMore.apply(container));
  },
};
