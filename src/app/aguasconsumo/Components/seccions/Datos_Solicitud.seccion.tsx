import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { authProvider } from 'app/shared/utils/authprovider.util';
import React, { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import Form, { FormInstance } from 'antd/es/form';
import '../../../../css/estilos.css';
import Input from 'antd/es/input';

export const DatosSolicitud: React.FC<DatosSolicitud<any>> = (props) => {
  const { obj, tipo, habilitar } = props;
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

  if (habilitar) {
    return (
      <section className='datos_solicitante'>
        <div className='container-fluid'>

          <div className='row' >
            <div className='col-lg-12 col-sm-12 col-md-12 contenedor_principal'>
              <div className='info-tramite mt-2 prueba_tramite'>
                <p className="prueba" style={{ fontSize: '18px', fontWeight: 'bold' }} id="other">
                  Datos de la solicitud. <br />{' '}
                  <small style={{ color: ' #000' }}>
                    <span className='required '>*</span> Campos Obligatorios
                  </small>
                </p>
              </div>
            </div>
          </div>
          <div className='row prueba_tramite' >
            <div className='col-lg-6 col-md-6'>
              <p className='text'>
                <span className='required'>*</span>
                Número de radicado
              </p>
              <div className='form-group gov-co-form-group'>
                <Form.Item className='campo' initialValue={obj?.consecutivo} name='numeroradicado' required={false}>
                  <Input type='text' className='form-control gov-co-form-control' disabled={true} defaultValue={''} />
                </Form.Item>
              </div>
            </div>
            <div className='col-lg-6 col-md-6'>
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
          <div className='row prueba_tramite'>
            <div className='col-lg-6 col-md-6 col-sm-12' >
              <div className='form-group gov-co-form-group'>
                <div className='gov-co-dropdown'>
                  <div className='form-group gov-co-form-group '>
                    <div className='gov-co-dropdown'>
                      <p className='text'>
                        <span className='required'>*</span> Estados
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
            <div className='col-lg-6 col-md-6 col-sm-12' >
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

          <div className='row prueba_tramite'>


            {tipousuario == 'coordinador' && (
              <div className='col-lg-6 col-md-6 col-sm-12 '>
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
            )}
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section className='datos_solicitante'>
        <div className='container-fluid'>
          <>
            <div className='row' style={{ marginLeft: '5px' }}>
              <div className='col-lg-12 col-sm-12 col-md-12'>
                <div className='info-tramite mt-2 prueba_tramite'>
                  <p style={{ fontSize: '18px', fontWeight: 'bold' }} id="other">
                    Datos de la solicitud. <br />{' '}
                    <small style={{ color: ' #000' }}>
                      <span className='required '>*</span> Campos Obligatorios
                    </small>
                  </p>
                </div>
              </div>
            </div>
            <div className='row prueba_tramite'>
              <div className='col-lg-6 col-md-6'>
                <p className='text'>
                  <span className='required'>*</span>
                  Número de radicado
                </p>
                <div className='form-group gov-co-form-group'>
                  <Form.Item initialValue={obj?.consecutivo} name='numeroradicado' required={false}>
                    <Input type='text' className='form-control gov-co-form-control' disabled={true} defaultValue={''} />
                  </Form.Item>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
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
                      disabled={true}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className='row prueba_tramite'>
              <div className='col-lg-6 col-md-6 col-sm-12'>
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
                            disabled={true}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
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
                        style={{ marginLeft: '-4px' }}
                        options={l_actividades}
                        defaultValue={obj?.idactividadActualSolicitud}
                        optionPropkey='idActividad'
                        optionPropLabel='descripcion'
                        disabled={true}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>


            {tipousuario == 'coordinador' && (
              <>
                <div className='row'>
                  <div className='col-lg-6 col-md-6 col-sm-12 '>
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
                            disabled={true}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        </div>
      </section>
    );
  }
};
interface DatosSolicitud<T> {
  form: FormInstance<T>;
  obj: any;
  tipo: string;
  habilitar: boolean;
}
export const KeysForm = ['statustramite', 'observations'];
