const useLogger = process.env.NODE_ENV === 'development';

export default {
  log(message: string, level = 'info'): void {
    if (!useLogger) {
      return;
    }

    if (level === 'error') {
      // eslint-disable-next-line no-console
      console.error(message);
    } else if (level === 'warn') {
      // eslint-disable-next-line no-console
      console.warn(message);
    } else if (level === 'info') {
      // eslint-disable-next-line no-console
      console.info(message);
    } else {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  },

  debug(message: string): void {
    this.log(message, 'debug');
  },

  info(message: string): void {
    this.log(message, 'info');
  },

  warn(message: string): void {
    this.log(message, 'warn');
  },

  error(message: string): void {
    this.log(message, 'error');
  },
};
