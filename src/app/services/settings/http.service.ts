import { confirmMessage, errorMessage, warningMessage, successMessage } from './message.service';
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { clearStorage } from 'app/shared/tools/storage.tool';
import { Loading } from 'app/redux/ui/ui.actions';
import { ModalFuncProps } from 'antd/es/modal';
import { store } from 'app/redux/app.reducers';

const cancelRequest = axios.CancelToken.source();
let source: any;

// Constantes
const http: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  cancelToken: cancelRequest.token
});

/**
 * Cargar el loading de la app.
 * @param status Mostrar u ocultar.
 */
const showLoading = (status: boolean) => store.dispatch(Loading(status));

//#region Funciones de validaciones

const isRegister = (url: string) => {
  return url.indexOf('AddRquest') && url.indexOf('AddFile');
};

const extract_data = <T>(response: AxiosResponse): T => {
  const {
    data: _response,
    config: { method, url, responseType }
  } = response;

  if (!!_response.message && method !== 'get') {
    if (!isRegister(url as string)) {
      successMessage({
        content: _response.message
      });
    }
  }

  if (!_response.data && response.status === 204) {
    successMessage({
      content: 'El registro fue eliminado exitosamente.'
    });

    return true as any;
  }

  if (responseType === 'blob') {
    showLoading(false);
    return _response;
  }

  showLoading(false);
  return _response.data;
};

const handle_error = (reject: any): Promise<Error> => {
  const response = reject?.response;
  const data = response?.data;
  const status = response?.status;

  const errorMessageDefault = 'Por favor intente de nuevo más tarde o póngase en contacto con soporte técnico.';
  const message = data?.message || errorMessageDefault;

  if (reject?.message === 'Cancel') {
    return Promise.reject(reject?.message);
  }

  switch (status) {
    case 0:
      clearStorage();
      warningMessage({ content: message });
      window.location.reload();
      break;
    case 401:
      clearStorage();
      warningMessage({ content: message });
      break;
    case 400:
    case 404:
    case 405:
    case 415:
    case 422:
      warningMessage({ content: message });
      break;

    default:
      errorMessage({ content: message });
  }

  showLoading(false);

  return Promise.reject(reject);
};

http.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const { headers } = config;
    const AccountInfoStorage = JSON.parse(localStorage.getItem('accountInfoStorage') as string);
    if (AccountInfoStorage) {
      const TokenInLocalStorage = JSON.parse(
        localStorage.getItem(
          '{"authority":"https://saludcapitalb2c.b2clogin.com/saludcapitalb2c.onmicrosoft.com/b2c_1_iniciosesionconregistro/","clientId":"f3e58d64-a12a-4db0-b982-b837f4c8325d","homeAccountIdentifier":"' +
            AccountInfoStorage.account.homeAccountIdentifier +
            '"}'
        ) as string
      );

      if (TokenInLocalStorage.accessToken) {
        headers.Authorization = 'Bearer ' + TokenInLocalStorage.accessToken;
      } else {
        headers.Authorization = '';
      }
    }

    return config;
  },
  (error: Error): Promise<Error> => Promise.reject(error)
);

http.interceptors.response.use(extract_data, handle_error);

//#region Metodos CRUD

/**
 * Método de Http para postear información.
 * @param params Configuración del servicio.
 * @returns Promesa con la respuesta del servicio.
 */
const post = async <T>({
  endpoint,
  url,
  payload,
  id,
  loading = true,
  options,
  configMessage,
  cancel,
  confirmModal = true
}: ISettingsService): Promise<T> => {
  var confirm = confirmModal;

  if (id == '0') {
    confirm = confirmModal
      ? await confirmMessage({
          content: '¿Está seguro de guardar la información?',
          ...configMessage
        })
      : await true;
  }

  if (confirm) {
    if (loading) {
      showLoading(true);
    }

    if (cancel && !!source) {
      source.cancel('Cancel');
      source = undefined;
    }

    const { CancelToken } = axios;
    source = CancelToken.source();
    return http.post(endpoint + url, payload, { ...options, cancelToken: source.token });
  } else {
    return Promise.reject();
  }
};

/**
 * Método de Http para actualizar información.
 * @param params Configuración del servicio.
 * @returns Promesa con la respuesta del servicio.
 */
const put = async <T>({
  endpoint,
  url,
  payload,
  id,
  loading = true,
  options,
  configMessage,
  cancel,
  confirmModal = true
}: ISettingsService): Promise<T> => {
  var confirm = confirmModal;

  if (id == '0') {
    confirm = confirmModal
      ? await confirmMessage({
          content: '¿Está seguro de guardar la información?',
          ...configMessage
        })
      : await true;
  }

  if (confirm) {
    if (loading) {
      showLoading(true);
    }

    if (cancel && !!source) {
      source.cancel('Cancel');
      source = undefined;
    }

    const { CancelToken } = axios;
    source = CancelToken.source();
    return http.put(endpoint + url, payload, { ...options, cancelToken: source.token });
  } else {
    return Promise.reject();
  }
};

/**
 * Método de Http para obtener información.
 * @param params Configuración del servicio.
 * @returns Promesa con la respuesta del servicio.
 */
const get = <T>({ endpoint, url, loading = true, options, id, cancel }: ISettingsService): Promise<T> => {
  if (loading) {
    showLoading(true);
  }

  if (cancel && !!source) {
    source.cancel('Cancel');
    source = undefined;
  }

  const { CancelToken } = axios;
  source = CancelToken.source();
  return http.get(endpoint + url, { ...options, cancelToken: source.token });
};

/**
 * Método de Http para eliminar información.
 * @param params Configuración del servicio.
 * @param message Mensaje personalizado para confirmar la eliminación de un registro.
 * @returns Promesa con la respuesta del servicio.
 */
const deleted = async <T>({
  endpoint,
  url,
  loading = true,
  id,
  options,
  configMessage,
  cancel
}: ISettingsService): Promise<T> => {
  const confirm = await confirmMessage({
    content: '¿Está seguro de borrar la información?',
    okType: 'danger',
    ...configMessage
  });

  if (confirm) {
    if (loading) {
      showLoading(true);
    }

    if (cancel && !!source) {
      source.cancel('Cancel');
      source = undefined;
    }

    const { CancelToken } = axios;
    source = CancelToken.source();
    return http.delete(endpoint + url, { ...options, cancelToken: source.token });
  } else {
    return Promise.reject();
  }
};

//#endregion
//#region Interfaces

/** Interface para la configuración de los métodos axios. */
interface ISettingsService {
  /** Endpoint principal del servicio. */
  endpoint: string;
  /** Ruta del Endpoint. */
  url: string;

  id: string;
  /** Mostrar el loading, por defecto es true. */
  loading?: boolean;
  /** Cuerpo del servicio. */
  payload?: any;
  /** Configuraciones del mensaje */
  configMessage?: ModalFuncProps;
  /** Configuraciones generales del axios. */
  options?: AxiosRequestConfig;
  /** Cancelar la petición anterior. */
  cancel?: boolean;
  /**Cancelar confirmacion de accion */
  confirmModal?: boolean;
}

//#endregion

export { http, showLoading, post, put, get, deleted };
