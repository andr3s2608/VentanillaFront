import React, { useCallback, useEffect, useState } from 'react';
import '../../../../css/estilos.css';
// Antd
import Form, { FormInstance } from 'antd/es/form';
import Input from 'antd/es/input';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { ApiService } from 'app/services/Apis.service';
import { authProvider } from 'app/shared/utils/authprovider.util';

export const DatosSolicitud: React.FC<DatosSolicitud<any>> = (props) => {
  const { obj, tipo } = props;
  const [[l_tramites, l_estados, l_actividades, l_subredes], setListas] = useState<[any[], any[], any[], any[]]>([
    [],
    [],
    [],
    []
  ]);

  const { accountIdentifier } = authProvider.getAccount();
  const api = new ApiService(accountIdentifier);

  const [tipousuario, settipousuario] = useState<string>('');

  const getListas = useCallback(
    async () => {
      const subredes: any = localStorage.getItem('subredes');
      const resp = await Promise.all([
        api.getTipoTramites(),
        api.getEstadosSolicitudAguas(),
        api.getActividades(),
        JSON.parse(subredes)
      ]);

      const lusuarios = await api.getFuncionarios();
      const usuarios: any[] = [];
      usuarios.push({ idPersona: 'vacio', fullName: 'No Asignar', oid: 'vacio' });

      for (let index = 0; index < lusuarios.length; index++) {
        usuarios.push(lusuarios.at(index));
      }

      setListas(resp);

      settipousuario(tipo);
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
              <Form.Item
                initialValue={obj?.idtipodeTramite}
                name='tipotramite'
                rules={[{ required: tipousuario == 'validacion' ? false : true }]}
              >
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
                    <Form.Item
                      initialValue={obj.idestado}
                      name='estado'
                      rules={[{ required: tipousuario == 'validacion' ? false : true }]}
                    >
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
                <Form.Item
                  initialValue={obj?.idactividadActualSolicitud}
                  name='actactual'
                  rules={[{ required: tipousuario == 'validacion' ? false : true }]}
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
        {tipousuario != 'validacion' && (
          <>
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
          </>
        )}

        {tipousuario == 'coordinador' && (
          <>
            <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
              <div className='panel-search'>
                <p className='text'>
                  <span className='required'>*</span>
                  Subred de jurisdicción
                </p>
                <div className='form-group gov-co-form-group ml-2'>
                  <div className='gov-co-dropdown'>
                    <Form.Item name='subred' initialValue={obj?.idSubred} rules={[{ required: true }]}>
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
