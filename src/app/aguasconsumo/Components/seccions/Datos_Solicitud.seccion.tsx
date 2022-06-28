import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';
import {
  dominioService,
  ETipoDominio,
  IBarrio,
  IDepartamento,
  IDominio,
  ILocalidad,
  IMunicipio,
  IUpz
} from 'app/services/dominio.service';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

//Redux
import { store } from 'app/redux/app.reducers';
import { SetViewLicence } from 'app/redux/controlViewLicence/controlViewLicence.action';

export const DatosSolicitud: React.FC<DatosSolicitud<any>> = (props) => {
  const { obj } = props;
  const [[l_tramites, l_estados, l_actividades, l_usuarios, l_subredes], setListas] = useState<
    [any[], any[], any[], any[], any[]]
  >([[], [], [], [], []]);
  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [idBogotac, setIdBogota] = useState<string>('Bogotá D.C.');
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const idmunicipio = '0e2105fb-08f8-4faf-9a79-de5effa8d198';

  const getListas = useCallback(
    async () => {
      //const resp = await dominioService.get_type(ETipoDominio['Tipo Documento']);

      const departamentos = await dominioService.get_departamentos_colombia();
      const municipios = await dominioService.get_all_municipios_by_departamento(idDepartamentoBogota);

      const resp = await Promise.all([
        api.getTipoTramites(),
        api.getEstadosSolicitudAguas(),
        api.getActividades(),
        api.getFuncionarios(),
        api.getSubredes()
      ]);
      setListas(resp);

      setLDepartamentos(departamentos);

      setLMunicipios(municipios);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className='row'>
        <div className='col-lg-12 col-sm-12 col-md-12'>
          <div className='info-tramite mt-2'>
            <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Datos de la solicitud. <br /> <small style={{ color: ' #000' }}>* Campos Obligatorios</small>
            </p>
          </div>
        </div>
        <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
          <div className='panel-search'>
            <div className='form-group gov-co-form-group'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Número de radicado' initialValue={obj?.numeroradicado} name='numeroradicado' required={false}>
                  <Input type='text' className='form-control gov-co-form-control' disabled={true} defaultValue={''} />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
          <div className='panel-search'>
            <p>Tipo de tramite</p>
            <div className='form-group gov-co-form-group'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Tipo de Tramite' initialValue={obj?.idtipodeTramite} name='tipotramite' required={true}>
                  <SelectComponent
                    options={l_tramites}
                    defaultValue={obj?.idtipodeTramite}
                    optionPropkey='idTipoTramite'
                    optionPropLabel='descripcion'
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
          <div className='panel-search'>
            <div className='form-group gov-co-form-group'>
              <div className='gov-co-dropdown'>
                <div className='form-group gov-co-form-group '>
                  <div className='gov-co-dropdown'>
                    <Form.Item label='Estado' initialValue={obj.idestado} name='estado' required={true}>
                      <SelectComponent
                        options={l_estados}
                        defaultValue={obj?.idestado}
                        optionPropkey='idEstadoSolicitud'
                        optionPropLabel='nombre'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
          <div className='panel-search'>
            <p>Actividad actual</p>

            <div className='form-group gov-co-form-group ml-2'>
              <div className='gov-co-dropdown'>
                <Form.Item
                  label='Actividad Actual'
                  initialValue={obj?.idactividadActualSolicitud}
                  name='actactual'
                  required={true}
                >
                  <SelectComponent
                    options={l_actividades}
                    defaultValue={obj?.idactividadActualSolicitud}
                    optionPropkey='idActividad'
                    optionPropLabel='descripcion'
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
          <div className='panel-search'>
            <div className='form-group gov-co-form-group'>
              <Form.Item
                label='Actividad Siguiente'
                initialValue={obj?.actividadSiguienteSolicitud}
                name='actsiguiente'
                required={true}
              >
                <Input
                  type='text'
                  className='form-control gov-co-form-control'
                  onKeyPress={(event) => {
                    if (!/[a-zA-Z ]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();
                  }}
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
          <div className='panel-search'>
            <p>Usuario asignado</p>
            <div className='form-group gov-co-form-group ml-2'>
              <div className='gov-co-dropdown'>
                <Form.Item label='Usuario Asignado' initialValue={''} name='usuarioasignado' required={true}>
                  <SelectComponent options={l_usuarios} defaultValue={''} optionPropkey='idPersona' optionPropLabel='fullName' />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
          <div className='panel-search'>
            <div className='form-group gov-co-form-group ml-2'>
              <div className='gov-co-dropdown'>
                <Form.Item label='Subred de Jurisdicción' name='subred' required={true}>
                  <SelectComponent
                    options={l_subredes}
                    defaultValue={obj?.idSubred}
                    optionPropkey='idSubRed'
                    optionPropLabel='zona'
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
interface DatosSolicitud<T> {
  form: FormInstance<T>;
  obj: any;
}
export const KeysForm = ['statustramite', 'observations'];
