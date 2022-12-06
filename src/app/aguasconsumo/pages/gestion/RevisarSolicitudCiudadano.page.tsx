import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { UbicacionPersona } from '../../Components/seccions/Ubicacion.seccion';
import { DatosDocumentos } from '../../Components/seccions/Documentos.seccion';
import { DatosAcueducto } from '../../Components/seccions/Acueductos.seccion';
import { authProvider } from 'app/shared/utils/authprovider.util';
import { IConsesion } from '../../Models/IConsecion';
import { useStepperForm } from 'app/shared/hooks/stepper.hook';
import React, { useCallback, useEffect, useState } from 'react';
import { ApiService } from 'app/services/Apis.service';
import { Alert, Form, Input, Steps } from 'antd';
import '../../../../css/estilos.css';
import Button from 'antd/es/button';
import Swal from 'sweetalert2';
import moment from 'moment';
import Tabs from 'antd/es/tabs';

export const RevisarSolicitudCiudadano = () => {
  const [form] = Form.useForm<any>();


  const getListas = useCallback(
    async () => {
    },
    []
  );
  useEffect(() => {
    getListas();

  }, []);

  return (
    <div className='fadeInTop container-fluid'>
      <div className='container-fluid'>
        <div className='card'>
          <div className='card-body'>
            <Form form={form} {...layoutItems} layout='horizontal'>
              <section className='info-panel'>
                <div className='container'>
                  <div className='row mt-2'>
                    <div className='col-lg-6 col-sm-12 col-md-6'>
                      <div className='info-secion'>
                        <nav aria-label='breadcrumb' style={{ backgroundColor: '#fff' }}>
                          <ol className='breadcrumb'>
                            <li className='breadcrumb-item'>
                              <a href='#'>Inicio</a>
                            </li>
                            <li className='breadcrumb-item active' aria-current='page'>
                              Crear Solicitud
                            </li>
                          </ol>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className='panel-menu'>
                <div className='col-lg-12 col-md-12 ml-4 col-sm-12 '>
                  <div className='row mt-3'>
                    <div className='col-lg-12 col-md-12'>
                      <div className='info-tramite'>
                        <p>Trámite: Autorización Sanitaria Para La Concesión De Aguas Para El Consumo Humano</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <p>
                algo que renderizar
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
