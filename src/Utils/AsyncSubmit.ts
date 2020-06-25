export interface FormResponse {
  message?: string;
  data?: Record<string, unknown>;
}

const asyncSubmit = (form: HTMLFormElement, onSuccess?: CallableFunction, onError?: CallableFunction): void => {
  const XHR = new XMLHttpRequest();

  // Handlers when successful network submit
  XHR.addEventListener('load', () => {
    const status = XHR.status;
    let responseObject: FormResponse;
    try {
      responseObject = JSON.parse(XHR.response);
    } catch (error) {
      // Nothing
    }

    if (status >= 400 && onError) {
      // Logical HTTP error
      onError(responseObject);
    }
    if (status < 300 && onSuccess) {
      // Success
      onSuccess(responseObject);
    }
  });

  if (onError) {
    // Network level error
    XHR.addEventListener('error', () => {
      onError();
    });
  }

  XHR.open(form.method || 'GET', form.action);
  XHR.send(new FormData(form));
};

export default asyncSubmit;
