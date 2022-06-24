import { SelectComponent } from 'app/shared/components/inputs/select.component';
import { Form, Input } from 'antd';

export const DatosSolicitante = () => {
  let tipoSolicitante = false;
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
              <p>Tipo de documento</p>
              <div className='form-group gov-co-form-group'>
                <div className='gov-co-dropdown'>
                  <Form.Item>
                    <SelectComponent placeholder='-- Seleccione --' options={[]} optionPropkey={''} disabled />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
            <div className='panel-search'>
              <p>Número de documento</p>
              <div className='form-group gov-co-form-group'>
                <Form.Item>
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
              <p>Primer nombre</p>
              <div className='form-group gov-co-form-group'>
                <Form.Item>
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
              <p>Segundo nombre</p>
              <div className='form-group gov-co-form-group'>
                <Form.Item>
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
              <p>Primer apellido </p>
              <div className='form-group gov-co-form-group'>
                <Form.Item>
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
              <p>Segundo apellido</p>
              <div className='form-group gov-co-form-group'>
                <Form.Item>
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
              <p>Teléfono de contacto 1 </p>
              <div className='form-group gov-co-form-group'>
                <Form.Item>
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
              <p>Teléfono de contacto 2</p>
              <div className='form-group gov-co-form-group'>
                <Form.Item>
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
              <p>Correo electrónico </p>
              <div className='form-group gov-co-form-group'>
                <Form.Item>
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
              <p>Tipo de documento</p>
              <div className='form-group gov-co-form-group'>
                <div className='gov-co-dropdown'>
                  <Form.Item>
                    <SelectComponent placeholder='-- Seleccione --' options={[]} optionPropkey={''} disabled />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          <div className='col-lg-4 col-sm-4 col-md-4 mt-4 ml-2'>
            <div className='panel-search'>
              <p>Número de documento</p>
              <div className='form-group gov-co-form-group'>
                <Form.Item>
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
              <p>Nombre entidad:</p>
              <div className='form-group gov-co-form-group'>
                <Form.Item>
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
