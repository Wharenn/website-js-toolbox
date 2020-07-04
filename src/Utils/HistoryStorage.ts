const utf8ToB64 = (str: string): string => {
  return window.btoa(unescape(encodeURIComponent(str)));
};

const maxItems = 20;

const sortBy = (key: string) => {
  return (a: Record<string, unknown>, b: Record<string, unknown>) => {
    if (a[key] < b[key]) {
      return 1;
    }
    if (b[key] < a[key]) {
      return -1;
    }

    return 0;
  };
};

interface StoredData {
  id: string | number;
  addedAt?: number;
}

const HistoryStorage = {
  add: (type: string, data: StoredData): void => {
    const base64type = utf8ToB64(type);

    let items;
    const itemsAsString = localStorage.getItem(base64type);

    // eslint-disable-next-line no-param-reassign
    data.addedAt = Date.now();

    if (itemsAsString === null) {
      items = [data];
    } else {
      items = JSON.parse(itemsAsString);

      const existingItem = items.find((item: StoredData) => item.id === data.id);
      if (existingItem) {
        existingItem.addedAt = Date.now();
      } else {
        items.push(data);
      }

      items = items.concat().sort(sortBy('addedAt'));
      items = items.slice(0, maxItems);
    }

    localStorage.setItem(base64type, JSON.stringify(items));
  },

  get: (type: string): Array<StoredData> => {
    const items = localStorage.getItem(utf8ToB64(type));

    if (!items) {
      return [];
    }

    return JSON.parse(items);
  },

  clear: (type: string): void => {
    localStorage.setItem(utf8ToB64(type), JSON.stringify([]));
  },
};

export default HistoryStorage;
