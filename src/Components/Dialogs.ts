import Swal from 'sweetalert2';

const swalDefaults = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

const Dialogs = {
  /**
   * Displays a confirm dialog box
   */
  confirm: (
    message: string,
    title?: string,
    confirmLabel = 'Yes',
    cancelLabel = 'Cancel',
    icon = 'question',
    confirmCallback?: CallableFunction,
    cancelCallback?: CallableFunction,
  ): void => {
    swalDefaults
      .fire({
        title: title || message,
        text: title ? message : undefined,
        icon,
        showCancelButton: true,
        confirmButtonText: confirmLabel,
        cancelButtonText: cancelLabel,
      })
      .then((result: { value: boolean }) => {
        if (result.value) {
          if (confirmCallback) {
            confirmCallback();
          }
        } else if (cancelCallback) {
          cancelCallback();
        }
      });
  },

  /**
   * Displays an informative dialog box
   */
  alert: (message: string, title?: string, confirmLabel = 'Ok', icon = 'warning', callback?: CallableFunction): void => {
    swalDefaults
      .fire({
        title: title || message,
        text: title ? message : undefined,
        icon,
        confirmButtonText: confirmLabel,
      })
      .then(() => {
        if (callback) {
          callback();
        }
      });
  },

  /**
   * Parse DOM and attach dialogs on elements
   */
  attachToDOM: (element?: HTMLElement): void => {
    (element || document).querySelectorAll<HTMLElement>('[data-dialog]').forEach((el) => {
      const type = el.dataset.dialog;
      if (type === 'alert') {
        el.addEventListener('click', (e) => {
          e.preventDefault();

          Dialogs.alert(el.dataset.dialogMessage, el.dataset.dialogTitle, el.dataset.dialogButtonConfirm, el.dataset.dialogIcon);
        });
      }
      if (type === 'confirm') {
        el.addEventListener('click', (e) => {
          e.preventDefault();

          Dialogs.confirm(
            el.dataset.dialogMessage,
            el.dataset.dialogTitle,
            el.dataset.dialogButtonConfirm,
            el.dataset.dialogButtonCancel,
            el.dataset.dialogIcon,
            () => {
              if (el.getAttribute('href')) {
                window.location.href = el.getAttribute('href');
              } else if (el.dataset.dialogRemoteFormId) {
                const form = document.getElementById(el.dataset.dialogRemoteFormId) as HTMLFormElement;
                if (form && form.submit) {
                  form.submit();
                }
              } else {
                const closestForm = el.closest('form');
                if (closestForm) {
                  closestForm.submit();
                }
              }
            },
          );
        });
      }
    });
  },
};

export default Dialogs;
