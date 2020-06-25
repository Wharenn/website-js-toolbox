export const showElement = (element: HTMLElement): void => {
  element.style.position = 'relative';
  element.style.left = '';
};

export const hideElement = (element: HTMLElement): void => {
  element.style.position = 'absolute';
  element.style.left = '-9999px';
};
