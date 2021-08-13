import { environments } from '../../environments/environments';
import { get, post } from './settings/http.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { IPersonaNatural } from 'app/Models/IPersonaNatural';
import { IResponse } from 'app/Models/IResponse';
import { IRoles } from 'app/Models/IRoles';
import { IMenu } from 'app/Models/IMenu';

const { accountIdentifier } = authProvider.getAccount();
const endpoint = environments.endpointV2;

export const personaNatural = (tipoDominio: IPersonaNatural) =>
  post<IPersonaNatural>({ endpoint: endpoint, url: `Persona/AddPersonaNatural` });

export const personaJuridica = (tipoDominio: IPersonaNatural) =>
  post<IPersonaNatural>({ endpoint: endpoint, url: `Persona/AddPersonaJuridica` });

export const GetMenuUser = () =>
  get<IMenu[]>({ endpoint: environments.security, url: `Security/GetMenuByUser/${accountIdentifier}` });

export const GetRoles = () =>
  get<IRoles[]>({ endpoint: environments.security, url: `Security/GetRoleByIdUser/${accountIdentifier}` });

export const GetSexo = () => get<[]>({ endpoint: environments.endpointV1, url: 'Sexo/GetSexo' });
export const GetEtnia = () => get<[]>({ endpoint: environments.endpointV1, url: 'Etnia/GetEtnia' });
