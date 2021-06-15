import Modal, { ModalFuncProps } from 'antd/es/modal';

/**
 * Servicio para la gestion de mensajes de la aplicación.
 * @param setting Configuración del mensaje.
 */
const defaultMessage = (
  setting: ModalFuncProps,
  type: 'success' | 'info' | 'warning' | 'error' | 'confirm'
): Promise<boolean> => {
  const { onOk, onCancel, okButtonProps, ...settingProps } = setting;

  return new Promise((resolve) => {
    Modal[type]({
      onOk: (close) => {
        close();
        resolve(true);

        if (!!onOk) {
          onOk();
        }
      },
      onCancel: (close) => {
        close();
        resolve(false);

        if (!!onCancel) {
          onCancel();
        }
      },
      centered: true,
      okButtonProps: { type: 'primary', ...okButtonProps },
      zIndex: 2001,
      ...settingProps
    });
  });
};

/**
 * Mensaje de proceso exitoso o completado.
 * @param setting Configuración del mensaje.
 */
const successMessage = (setting: ModalFuncProps): Promise<boolean> =>
  defaultMessage(
    {
      title: 'Mensaje de Validación',
      ...setting
    },
    'success'
  );

/**
 * Mensaje de información.
 * @param setting Configuración del mensaje.
 */
const infoMessage = (setting: ModalFuncProps): Promise<boolean> =>
  defaultMessage(
    {
      title: 'Mensaje de Información',
      okType: 'default',
      ...setting
    },
    'info'
  );

/**
 * Mensaje de error o proceso fallido.
 * @param setting Configuración del mensaje.
 */
const errorMessage = (setting: ModalFuncProps): Promise<boolean> =>
  defaultMessage(
    {
      title: 'Mensaje de Error',
      okType: 'danger',
      ...setting
    },
    'error'
  );

/**
 * Mensaje de advertencia.
 * @param setting Configuración del mensaje.
 */
const warningMessage = (setting: ModalFuncProps): Promise<boolean> =>
  defaultMessage(
    {
      title: 'Mensaje de Advertencia',
      okType: 'default',
      ...setting
    },
    'warning'
  );

/**
 * Mensaje de confirmación.
 * @param setting Configuración del mensaje.
 */
const confirmMessage = (setting: ModalFuncProps): Promise<boolean> =>
  defaultMessage(
    {
      title: 'Mensaje de Confirmación',
      okType: 'default',
      okText: 'Continuar',
      cancelText: 'Cancelar',
      ...setting
    },
    'confirm'
  );

export { successMessage, infoMessage, warningMessage, errorMessage, confirmMessage };
