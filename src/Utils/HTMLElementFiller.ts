import Logger from './Logger';

interface FillerInstruction {
  source: string;
  target: string;
}

export default {
  /**
   * Fill an html element with data from an object.
   * Data source from the object and data target in the element can be configured.
   */
  fill: (element: HTMLElement, data: Record<string, unknown>): void => {
    let instructions: FillerInstruction;
    try {
      instructions = JSON.parse(element.dataset.filler);
    } catch (error) {
      Logger.warn('Identity: could not fill element, filler instructions not readable');
      return;
    }

    const { source, target } = instructions;

    // Searching the "level1.level2" source within identity
    let value = data;
    const path = source.split('.');
    for (let i = 0; i < path.length; i++) {
      value = value[path[i]];

      if (!value) {
        Logger.warn(`Identity: could not fill element,${path[i]} not defined`);
        break;
      }
    }

    // If target attribute, set value in it, otherwise set in html content
    if (target) {
      element.setAttribute(target, value);
    } else {
      element.innerHTML = value;
    }
  },
};
