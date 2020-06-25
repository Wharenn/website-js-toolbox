import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
  duration: 4000,
  dismissible: true,
});

const success = (message: string): void => {
  notyf.success(message);
};

const error = (message: string): void => {
  notyf.error(message);
};

const notify = (message: string, type: string): void => {
  if (type === 'success') {
    success(message);
  }
  if (type === 'error') {
    error(message);
  }
};

export default {
  notifyFromDOM: (selector = '.flash-message'): void => {
    document.querySelectorAll<HTMLElement>(selector).forEach((el): void => {
      const { message, type } = el.dataset;
      notify(message, type);
    });
  },

  notify,
  success,
  error,
};
