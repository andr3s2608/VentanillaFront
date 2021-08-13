import { environments } from '../../environments/environments';
import { get, post } from './settings/http.service';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { IPersonaNatural } from 'app/Models/IPersonaNatural';
import { IResponse } from 'app/Models/IResponse';
import { IRoles } from 'app/Models/IRoles';
import { IMenu } from 'app/Models/IMenu';

export class ApiService {
  endpoint = environments.endpointV2;
  private oid = '';
  constructor(oid$: string) {
    this.oid = oid$;
  }
  personaNatural = (tipoDominio: IPersonaNatural) =>
    post<IPersonaNatural>({ endpoint: this.endpoint, url: `Persona/AddPersonaNatural` });

  personaJuridica = (tipoDominio: IPersonaNatural) =>
    post<IPersonaNatural>({ endpoint: this.endpoint, url: `Persona/AddPersonaJuridica` });

  GetMenuUser = () => get<IMenu[]>({ endpoint: environments.security, url: `Security/GetMenuByUser/${this.oid}` });

  GetRoles = () => get<IRoles[]>({ endpoint: environments.security, url: `Security/GetRoleByIdUser/${this.oid}` });

  GetSexo = () => get<[]>({ endpoint: environments.endpointV1, url: 'Sexo/GetSexo' });

  GetEtnia = () => get<[]>({ endpoint: environments.endpointV1, url: 'Etnia/GetEtnia' });
}
