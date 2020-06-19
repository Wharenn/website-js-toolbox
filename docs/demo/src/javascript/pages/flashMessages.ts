import * as WebsiteJsToolbox from "website-js-toolbox";

const { FlashMessages } = WebsiteJsToolbox;


export default {
    init: () => {
        document.querySelector('[data-flash-button=success]').addEventListener('click', () => {
            FlashMessages.success('This is a success!');
        });

        document.querySelector('[data-flash-button=error]').addEventListener('click', () => {
            FlashMessages.error('This is an error!');
        });

        document.querySelector('[data-flash-button=dom]').addEventListener('click', () => {
            FlashMessages.notifyFromDOM();
        });
    }
}