import * as WebsiteJsToolbox from 'website-js-toolbox';

const { Dialogs } = WebsiteJsToolbox;

export default {
  init: (): void => {
    document.querySelector('[data-demo-dialog=confirm]').addEventListener('click', () => {
      Dialogs.confirm('This is a confirm with a simple title');
    });
    document.querySelector('[data-demo-dialog=confirm-full]').addEventListener('click', () => {
      Dialogs.confirm(
        'This is a full optionned confirm with a custom icon',
        'See this?',
        'Yes, ok!',
        'No, cancel',
        'warning',
        () => {
          Dialogs.alert('And with a SUCCESS callback when confirmed!');
        },
        () => {
          Dialogs.alert('And with a CANCEL callback when canceled!');
        },
      );
    });
    document.querySelector('[data-demo-dialog=alert]').addEventListener('click', () => {
      Dialogs.alert('This is an alert with a simple title');
    });
    document.querySelector('[data-demo-dialog=alert-full]').addEventListener('click', () => {
      Dialogs.alert('This is a full optionned alert with a custom icon', 'See this?', 'Yes, ok!', 'info', () => {
        Dialogs.alert('And with a callback when confirmed!');
      });
    });

    Dialogs.attachToDOM();
  },
};
