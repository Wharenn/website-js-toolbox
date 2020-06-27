import Modal from '../Modal/Modal';
import asyncSubmit, { FormResponse } from '../../Utils/AsyncSubmit';
import FlashMessages from '../FlashMessages';
import './SearchModal.scss';
import { hideElement } from '../../Utils/Hide';
import SeeMore from '../SeeMore/SeeMore';
import { Logger } from '../../index';
import Translations from '../../Utils/Translations';
import Template from '../Template/Template';

interface SearchModalParams {
  formTypeClass?: string;
  isMultiple?: boolean;
  doDisplayInitialData?: boolean;
  onSearchFormLoaded?: CallableFunction;
}

let selectedItems: Array<Record<string, unknown>>;

const displayResults = (data: Record<string, unknown>, modalContent: HTMLElement, selectItemHandler: CallableFunction): void => {
  hideElement(modalContent.querySelector('[data-searchmodal-start]'));
  const resultsContainer = modalContent.querySelector('[data-searchmodal-results]') as HTMLElement;
  resultsContainer.classList.remove('SearchModal__Results--hidden');

  SeeMore.clear(resultsContainer);

  const initialItemsContainer = modalContent.querySelector('[data-seemore-initial-items]');
  initialItemsContainer.innerHTML = JSON.stringify(data);

  SeeMore.apply(resultsContainer, () => {
    modalContent.querySelectorAll('[data-seemore-item] button').forEach((button: HTMLElement) => {
      // Prevent adding listener twice
      if (button.dataset.hasListener) {
        return;
      }

      button.dataset.hasListener = 'true';
      button.addEventListener('click', (e) => selectItemHandler(e));
    });
  });
};

const addItemToSelection = (payload: Record<string, unknown>): void => {
  if (selectedItems.findIndex((item) => item.id === payload.id) !== -1) {
    return;
  }

  selectedItems.push(payload);

  const templateElement = document.querySelector('[data-selection-template]') as HTMLElement;
  const anchorElement = document.querySelector('[data-selection-anchor]') as HTMLElement;
  Template.apply(templateElement, payload, anchorElement, 'child', (element: HTMLElement) => {
    element.querySelector('[data-selection-remove]').addEventListener('click', (e) => {
      e.preventDefault();

      const link = e.currentTarget as HTMLElement;
      const selectionElement = link.closest('[data-selected-item]') as HTMLElement;
      const id = selectionElement.dataset.selectedItem;

      removeItemFromSelection(id);
    });
  });
};

const removeItemFromSelection = (itemId: string): void => {
  document.querySelectorAll(`[data-selected-item="${itemId}"]`).forEach((el) => {
    el.remove();
  });

  const itemToRemove = selectedItems.findIndex((item) => item.id === parseInt(itemId));
  selectedItems.splice(itemToRemove, 1);
};

const templateSingle = `
<div class="SearchModal">
  <div class="SearchModal__SearchContainer">
    <div class="SearchModal__Form" data-searchmodal-form></div>
    <h3>${Translations.trans('searchModal.results')}</h3>
    <div class="SearchModal__Start" data-searchmodal-start>
      ${Translations.trans('searchModal.startSearching')}
    </div>
    <div class="SearchModal__Results SearchModal__Results--hidden" data-searchmodal-results>
      <div data-seemore-initial-items></div>
      <script data-seemore-template type="text/x-handlebars-template">
        {{#each items}}
            <div class="SearchModal__Result" data-seemore-item='{ "id": {{ this.id }}, "name": "{{ escape this.name }}", "description": "{{ escape this.description }}", "picture": "{{ this.picture }}" }'>
                {{#if this.picture}}
                <img class="SearchModal__Result__Picture" src="{{this.picture}}"/>
                {{/if}}
                <div class="SearchModal__Result__Content">
                  <div class="SearchModal__Result__Title">{{this.name}}</div>
                  <div class="SearchModal__Result__Description">{{this.description}}</div>
                </div>
                <div class="SearchModal__Result__Buttons">
                  <button class="Button Button--primary">${Translations.trans('searchModal.select')}</button>
                </div>
            </div>
        {{/each}}
      </script>
      <div data-seemore-bottom class="SearchModal__Results__ButtonContainer">
        <a href="#" class="SearchModal__Results__SeeMoreButton Button" data-seemore-link>${Translations.trans('global.seeNextResults')}</a>
      </div>
    </div>
  </div>
</div>
`;

const templateMultiple = `
<div class="SearchModal SearchModal--multiple">
  <div class="SearchModal__SearchContainer">
    <div class="SearchModal__Form" data-searchmodal-form></div>
    <div class="SearchModal__Start" data-searchmodal-start>
      ${Translations.trans('searchModal.startSearching')}
    </div>
    <div class="SearchModal__Results SearchModal__Results--hidden" data-searchmodal-results>
      <h3>${Translations.trans('searchModal.results')}</h3>
      <div data-seemore-initial-items></div>
      <script data-seemore-template type="text/x-handlebars-template">
        {{#each items}}
            <div class="SearchModal__Result" data-seemore-item='{ "id": {{ this.id }}, "name": "{{ escape this.name }}", "description": "{{ escape this.description }}", "picture": "{{ this.picture }}" }'>
                {{#if this.picture}}
                <img class="SearchModal__Result__Picture" src="{{this.picture}}"/>
                {{/if}}
                <div class="SearchModal__Result__Content">
                  <div class="SearchModal__Result__Title">{{this.name}}</div>
                  <div class="SearchModal__Result__Description">{{this.description}}</div>
                </div>
                <div class="SearchModal__Result__Buttons">
                  <button class="Button">${Translations.trans('searchModal.addToSelection')}</button>
                </div>
            </div>
        {{/each}}
      </script>
      <div data-seemore-bottom class="SearchModal__Results__ButtonContainer">
        <a href="#" class="SearchModal__Results__SeeMoreButton Button" data-seemore-link>${Translations.trans('global.seeNextResults')}</a>
      </div>
    </div>
  </div>
  <div class="SearchModal__Selection">
    <h3>${Translations.trans('searchModal.selectedItems')}</h3>
    <ul class="SearchModal__SelectedItems" data-selection-anchor>
      <script data-selection-template type="text/x-handlebars-template">
        <li class="SearchModal__SelectedItem" data-selected-item="{{this.id}}">
            {{#if this.picture}}
            <img class="SearchModal__SelectedItem__Picture" src="{{this.picture}}"/>
            {{/if}}
            <div class="SearchModal__SelectedItem__Name">
              {{this.name}}
            </div>
            <div class="SearchModal__SelectedItem__Actions">
              <a href="#" data-selection-remove>
                <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M.3 9.7c.2.2.4.3.7.3.3 0 .5-.1.7-.3L5 6.4l3.3 3.3c.2.2.5.3.7.3.2 0 .5-.1.7-.3.4-.4.4-1 0-1.4L6.4 5l3.3-3.3c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L5 3.6 1.7.3C1.3-.1.7-.1.3.3c-.4.4-.4 1 0 1.4L3.6 5 .3 8.3c-.4.4-.4 1 0 1.4z" fill="#000" fill-rule="nonzero"></path></svg>
              </a>
            </div>
        </li>
      </script>
    </ul>
  </div>
</div>
`;

const SearchModal = {
  open: (formUrl: string, options: SearchModalParams = {}, onValidate?: CallableFunction): void => {
    const modal = Modal.openEmpty({ isLarge: true, hideFooter: !options.isMultiple });
    const template = options.isMultiple ? templateMultiple : templateSingle;
    modal.setContent(template);
    Modal.setLoading(modal, true);

    let selectItemHandler: CallableFunction;
    if (options.isMultiple) {
      selectedItems = [];

      // When multiple mode, popin validation in on the footer
      modal.addFooterBtn(Translations.trans('global.validate'), 'tingle-btn tingle-btn--pull-right tingle-btn--primary', () => {
        if (onValidate) {
          onValidate(selectedItems);
        }

        modal.close();
      });

      // Multiple selection mode, the select button will add the payload to selection
      selectItemHandler = (e: Event) => {
        e.preventDefault();

        const button = e.currentTarget as HTMLElement;
        const item = button.closest('[data-seemore-item]') as HTMLElement;

        try {
          const payload = JSON.parse(item.dataset.seemoreItem);

          addItemToSelection(payload);
        } catch (error) {
          Logger.warn(`Could not parse payload as json: ${error}`);
        }
      };
    } else {
      // Single selection mode, the select button will callback and close the modal
      selectItemHandler = (e: Event) => {
        e.preventDefault();

        const button = e.currentTarget as HTMLElement;
        const item = button.closest('[data-seemore-item]') as HTMLElement;

        try {
          const payload = JSON.parse(item.dataset.seemoreItem);

          if (onValidate) {
            onValidate(payload);
          }
          modal.close();
        } catch (error) {
          Logger.warn(`Could not parse payload as json: ${error}`);
        }
      };
    }

    fetch(formUrl, { headers: new Headers({ 'X-Requested-With': 'XMLHttpRequest' }) })
      .then((response) => response.text())
      .then((response) => {
        const content: HTMLElement = modal.getContent();
        const formContainer = content.querySelector('[data-searchmodal-form]');
        formContainer.innerHTML = response;

        const submitForm = (e?: Event) => {
          if (e) {
            e.preventDefault();
          }

          Modal.setLoading(modal, true);
          asyncSubmit(
            form,
            (formResponse: FormResponse) => {
              if (formResponse.data) {
                displayResults(formResponse.data, content, selectItemHandler);
                Modal.setLoading(modal, false);
              }
            },
            (formResponse: FormResponse) => {
              Modal.setLoading(modal, false);
              FlashMessages.error(formResponse && formResponse.message ? formResponse.message : 'Error');
            },
          );
        };

        const form: HTMLFormElement = content.querySelector('form');
        const formSubmitButton: HTMLFormElement = content.querySelector('[data-searchmodal-button-search]');

        form.addEventListener('submit', submitForm);
        formSubmitButton.addEventListener('click', submitForm);

        // Try to focus on the first form element
        const input = form.querySelector('input[type=text]') as HTMLElement;
        if (input) {
          input.focus();
        }

        if (options.onSearchFormLoaded) {
          options.onSearchFormLoaded(form);
        }

        if (options.doDisplayInitialData) {
          submitForm();
          // We do not remove loading here, this will be done in end of submit form
        } else {
          Modal.setLoading(modal, false);
        }
      });
  },
};

export default SearchModal;
