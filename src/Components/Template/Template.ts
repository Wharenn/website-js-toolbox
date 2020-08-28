import Handlebars from 'handlebars';
import Logger from '../../Utils/Logger';
import Translations from '../../Utils/Translations';
import FlashMessages from '../FlashMessages';
import Loader from '../../Utils/Loader';
import './Template.scss';

const insertElements = (anchorElement: HTMLElement, anchorType: string, element: HTMLElement) => {
  let insertedElement;
  if (anchorType === 'child') {
    insertedElement = anchorElement.insertBefore(element, null);
  } else if (anchorType === 'before') {
    insertedElement = anchorElement.parentNode.insertBefore(element, anchorElement);
  } else if (anchorType === 'after') {
    insertedElement = anchorElement.parentNode.insertBefore(element, anchorElement.nextSibling);
  } else {
    Logger.warn(`Anchor type ${anchorType} not supported. Supported anchors: child, before, after.`);
  }

  return insertedElement;
};

let loadingElement: HTMLElement;

const createLoadingElement = (): HTMLElement => {
  if (loadingElement) {
    return loadingElement;
  }

  loadingElement = document.createElement('div');
  loadingElement.classList.add('Template__Loader');
  loadingElement.innerHTML = Loader.getCircle();

  return loadingElement;
};

const onTriggerClick = (e: Event) => {
  e.preventDefault();

  const trigger = e.currentTarget as HTMLElement;

  // In DOM trigger, there is no use case for multi loading, so protecting it.
  const isTemplateLoaded = trigger.dataset.isTemplateLoaded;
  if (isTemplateLoaded) {
    return;
  }

  trigger.dataset.isTemplateLoaded = 'true';
  const templateElementId = trigger.dataset.templateId;
  const anchorElementId = trigger.dataset.anchorId;
  const anchorType = trigger.dataset.anchorType || 'after';
  const dataElementId = trigger.dataset.dataId;
  const dataUrl = trigger.dataset.dataUrl;

  const templateElement = document.getElementById(templateElementId);
  if (!templateElement) {
    Logger.warn(`Could not find template with id ${templateElementId}`);
  }

  // If no anchor element passed, assert the trigger is the anchor
  const anchorElement = anchorElementId ? document.getElementById(anchorElementId) : trigger;
  if (!anchorElement) {
    Logger.warn(`Could not find template with id ${anchorElementId}`);
  }

  if (dataElementId) {
    const dataElement = document.getElementById(dataElementId);

    if (dataElement) {
      try {
        const data = JSON.parse(dataElement.innerHTML);

        Template.apply(templateElement, data, anchorElement, anchorType);
      } catch (error) {
        Logger.warn('Failed to parse data to set in template.');
      }
    }
  } else if (dataUrl) {
    const insertedLoadingElement = insertElements(anchorElement, anchorType, loadingElement || createLoadingElement());
    fetch(dataUrl, { headers: new Headers({ 'X-Requested-With': 'XMLHttpRequest' }) })
      .then((response) => response.json())
      .then((response) => {
        insertedLoadingElement.remove();
        Template.apply(templateElement, response, anchorElement, anchorType);
      })
      .catch((error) => {
        console.error(error);
        FlashMessages.error(Translations.trans('global.error'));
      });
  }
};

const Template = {
  apply: (
    templateElement: HTMLElement,
    data: Record<string, unknown>,
    anchorElement: HTMLElement,
    anchorType = 'child',
    onUpdate?: CallableFunction,
  ): void => {
    const template = Handlebars.compile(templateElement.innerHTML);

    // Use a temporary div to be able to retrieve an HTMLElement
    const element = document.createElement('div');
    element.innerHTML = template(data);
    const newNodes = element.children[0] as HTMLElement;

    const elements = insertElements(anchorElement, anchorType, newNodes);

    if (onUpdate) {
      onUpdate(elements);
    }
  },

  attachToDOM: (element?: HTMLElement): void => {
    (element || document).querySelectorAll<HTMLElement>('[data-template-trigger]').forEach((trigger) => {
      trigger.addEventListener('click', onTriggerClick);
    });
  },
};

export default Template;
