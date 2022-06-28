import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { Form, Input } from 'antd';

export const DatosSolicitante = (props: any) => {
  const { obj } = props;
  /** la variable tipoSolicitante se termina de ajustar cuando se consumar el end-point */
  let tipoSolicitante = true;
  console.log(obj);
  return (
    <>
      <div className='col-lg-12 col-sm-12 col-md-12'>
        <div className='info-tramite mt-2'>
          <p className='ml-2' style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Datos del solicitante. <br /> <small style={{ color: '#000' }}>* Campos Obligatorios</small>
          </p>
        </div>

        <div className='col-lg-6 col-sm-4 col-md-6 mt-2'>
          <div className='panel-search'>
            <div className='form-group gov-co-form-group'>
              <div className='gov-co-dropdown'>
                <Form.Item label='Tipo de Solicitante' name='persona' rules={[{ required: true }]}>
                  <SelectComponent
                    options={[
                      { key: 'natural', value: 'Persona Natural' },
                      { key: 'juridica', value: 'Persona Jurídica' }
                    ]}
                    defaultValue={'PERSONA NATURAL'}
                    optionPropkey='key'
                    optionPropLabel='value'
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </div>

      {tipoSolicitante ? (
        <>
          <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <div className='gov-co-dropdown'>
                  <Form.Item label='Tipo de documento:' name='tipoDocumento'>
                    <SelectComponent placeholder='-- Seleccione --' options={[]} optionPropkey={''} disabled />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Número de documento' name='numeroDocumento'>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Primer Nombre:' name='primerNombre'>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Segundo nombre:' name='segundoNombre'>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Primer apellido' name='primerApellido'>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Segundo Apellido' name='segundoApellido'>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Teléfono de contacto 1' name='telCont1'>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Teléfono de contacto 2' name='telCont2'>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className='col-lg-4 col-sm-4 col-md-4 mt-2 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Correo electrónico' name='email'>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z0-9ZñÑ@._-]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <div className='gov-co-dropdown'>
                  <Form.Item label='Tipo de documento:' name='tipoDocumento'>
                    <SelectComponent placeholder='-- Seleccione --' options={[]} optionPropkey={''} disabled />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Número de documento' name='numeroDocumento'>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
            <div className='panel-search'>
              <div className='form-group gov-co-form-group'>
                <Form.Item label='Nombre de la entidad' name='nombreEntidad'>
                  <Input
                    type='text'
                    className='form-control gov-co-form-control'
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                    }}
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
