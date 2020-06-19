import * as WebsiteJsToolbox from "website-js-toolbox";

const { Logger } = WebsiteJsToolbox;

const getMessage = () => {
    return document.querySelector('[data-log-message]').innerHTML;
}

export default {
    init: () => {
        document.querySelector('[data-log=debug]').addEventListener('click', () => {
            Logger.debug(getMessage());
        });

        document.querySelector('[data-log=info]').addEventListener('click', () => {
            Logger.info(getMessage());
        });

        document.querySelector('[data-log=warn]').addEventListener('click', () => {
            Logger.warn(getMessage());
        });

        document.querySelector('[data-log=error]').addEventListener('click', () => {
            Logger.error(getMessage());
        });
    }
}