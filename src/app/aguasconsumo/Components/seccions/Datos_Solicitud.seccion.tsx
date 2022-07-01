import React, { useCallback, useEffect, useState } from 'react';
import '../../../../css/estilos.css';
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
  const { obj, tipo } = props;
  const [[l_tramites, l_estados, l_actividades, l_subredes], setListas] = useState<[any[], any[], any[], any[]]>([
    [],
    [],
    [],
    []
  ]);
  const [l_departamentos, setLDepartamentos] = useState<IDepartamento[]>([]);
  const [l_usuarios, setLl_usuarios] = useState<any[]>([]);
  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);
  const [seleccionar, setseleccionar] = useState<boolean>(true);
  const [tipousuario, settipousuario] = useState<boolean>(true);

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
        api.getSubredes()
      ]);

      const lusuarios = await api.getFuncionarios();
      const usuarios: any[] = [];
      usuarios.push({ idPersona: 'vacio', fullName: 'No Asignar', oid: 'vacio' });

      for (let index = 0; index < lusuarios.length; index++) {
        usuarios.push(lusuarios.at(index));
      }

      setLl_usuarios(usuarios);

      setListas(resp);

      setLDepartamentos(departamentos);

      if (tipo == 'coordinador') {
        settipousuario(true);
      } else {
        settipousuario(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Onchangecoordinador = (value: any) => {
    if (value == 'vacio') {
      setseleccionar(false);
    } else {
      setseleccionar(true);
    }
  };

  return (
    <>
      <div className='row'>
        <div className='col-lg-12 col-sm-12 col-md-12'>
          <div className='info-tramite mt-2'>
            <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Datos de la solicitud. <br />{' '}
              <small style={{ color: ' #000' }}>
                <span className='required'>*</span> Campos Obligatorios
              </small>
            </p>
          </div>
        </div>
        <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
          <div className='panel-search'>
            <p className='text'>
              <span className='required'>*</span>
              Número de radicado
            </p>
            <div className='form-group gov-co-form-group'>
              <Form.Item initialValue={obj?.numeroradicado} name='numeroradicado' required={false}>
                <Input type='text' className='form-control gov-co-form-control' disabled={true} defaultValue={''} />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
          <div className='panel-search'>
            <p className='text'>
              <span className='required'>*</span> Tipo de tramite
            </p>
            <div className='form-group gov-co-form-group'>
              <Form.Item initialValue={obj?.idtipodeTramite} name='tipotramite' rules={[{ required: true }]}>
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

        <div className='col-lg-4 col-sm-4 col-md-4 mt-2'>
          <div className='panel-search'>
            <div className='form-group gov-co-form-group'>
              <div className='gov-co-dropdown'>
                <div className='form-group gov-co-form-group '>
                  <div className='gov-co-dropdown'>
                    <p className='text'>
                      <span className='required'>*</span> Estado
                    </p>
                    <Form.Item initialValue={obj.idestado} name='estado' rules={[{ required: true }]}>
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
        <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
          <div className='panel-search'>
            <p className='text'>
              <span className='required'>*</span> Actividad Actual
            </p>
            <div className='form-group gov-co-form-group ml-2'>
              <div className='gov-co-dropdown'>
                <Form.Item initialValue={obj?.idactividadActualSolicitud} name='actactual' rules={[{ required: true }]}>
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
            <p className='text'>
              <span className='required'>*</span> Actividad Siguiente
            </p>
            <div className='form-group gov-co-form-group'>
              <Form.Item initialValue={obj?.actividadSiguienteSolicitud} name='actsiguiente' rules={[{ required: false }]}>
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
        {tipousuario && (
          <>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p className='text'>
                  <span className='required'>*</span> Usuario Asignado
                </p>
                <div className='form-group gov-co-form-group ml-2'>
                  <div className='gov-co-dropdown'>
                    <Form.Item initialValue={obj?.idusuario ?? 'vacio'} name='usuarioasignado' rules={[{ required: false }]}>
                      <SelectComponent
                        options={l_usuarios}
                        onChange={Onchangecoordinador}
                        defaultValue={obj?.idusuario ?? 'vacio'}
                        optionPropkey='oid'
                        optionPropLabel='fullName'
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p className='text'>
                  <span className='required'>*</span>
                  Subred de jurisdicción
                </p>
                <div className='form-group gov-co-form-group ml-2'>
                  <div className='gov-co-dropdown'>
                    <Form.Item name='subred' initialValue={obj?.idSubred} rules={[{ required: seleccionar }]}>
                      <SelectComponent
                        options={l_subredes}
                        defaultValue={obj?.idSubred}
                        optionPropkey='idSubRed'
                        optionPropLabel='zona'
                        disabled={!seleccionar}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
interface DatosSolicitud<T> {
  form: FormInstance<T>;
  obj: any;
  tipo: string;
}
export const KeysForm = ['statustramite', 'observations'];
