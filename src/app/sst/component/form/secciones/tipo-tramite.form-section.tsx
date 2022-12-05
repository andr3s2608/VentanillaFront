import React, {useCallback, useEffect, useState} from 'react';
import Form, {FormInstance} from 'antd/es/form';
import Radio, {RadioChangeEvent} from 'antd/es/radio';
import {SelectComponent} from '../../../../shared/components/inputs/select.component';
import {dominioService, ETipoDominio, IDepartamento, IDominio, IMunicipio} from '../../../../services/dominio.service';
import Upload from 'antd/es/upload';
import Button from 'antd/es/button';
import {UploadOutlined} from '@ant-design/icons';
import Input from 'antd/es/input';
import moment from 'moment';
import {DatepickerComponent} from '../../../../shared/components/inputs/datepicker.component';
import Swal from 'sweetalert2';
import Divider from 'antd/es/divider';

export const TipoTramiteFormSeccion: React.FC<ITipoTramiteProps<any>> = (props) => {

  const { obj } = props;
  const isPrimeraVez = false;
  const [getIsPrimeraVez, setIsPrimeraVez] = useState<boolean>(isPrimeraVez);
  const isModificacion = false;
  const [getIsModificacion, setIsModificacion] = useState<boolean>(isModificacion);
  const isRenovacion = false;
  const [getIsRenovacion, setIsRenovacion] = useState<boolean>(isRenovacion);
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const [[l_departamentos_colombia, l_paises, l_sitio_defuncion, l_area_defuncion], setListas] = useState<
    [IDepartamento[], IDominio[], IDominio[], IDominio[]]
    >([[], [], [], []]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [isColombia, setIsColombia] = useState(true);
  const [isBogota, setIsBogota] = useState(false);
  const [ciudadBogota, setciudadBogota] = useState<string>('Bogotá D.C.');

 // const [[l_motivo_modificacion], setListas] = useState<[IDominio[]]>([[]]);
  const l_motivo_modificacion = [
    {
      id:1,
      descripcion: 'Cambio de nombre y/o apellido del titular de la licencia'
    },
    {
      id:2,
      descripcion: 'Cambio de número y tipo de identificación'
    },
    {
      id:3,
      descripcion: 'Cambio en el nivel de formación de seguridad y salud en el trabajo'
    },
  ]

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onChangeTipoTramite = (e: RadioChangeEvent) => {

    setIsPrimeraVez(e.target.value === 'primera-vez');
    setIsModificacion(e.target.value === 'modificacion');
    if (e.target.value === 'renovacion') {
      popUpRenovacionLicencia();
    }else {
      setIsRenovacion(false);
    }
  };

  const popUpRenovacionLicencia = () => {
    Swal.fire({
      icon: 'question',
      title: 'Renovación de licencias',
      text: 'La licencia que desea renovar debe pertenecer a Bogotá. De lo contrario debe contactar el ente territorial correspondiente.\n' +
        '¿La licencia a renovar pertenece a Bogotá?',
      showCancelButton: true,
      cancelButtonText: 'NO',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI'
    }).then((result) => {
      if (result.isDenied || result.isDismissed) {
        Swal.fire(
          'Renovación de licencias',
          'No es posible continuar con el trámite ya que no pertenece a Bogotá',
          'error'
        )
      } else {
        setIsRenovacion(true);
      }
    });
  };

  const onChangeDepartamento = async (value: string) => {
    props.form.setFieldsValue({ city: undefined });

    let departamento = l_departamentos_colombia.filter((i) => i.idDepartamento == value);

    const { idDepartamento } = departamento[0];

    const resp = await dominioService.get_all_municipios_by_departamento(idDepartamento);
    setLMunicipios(resp);

    if (value == '31b870aa-6cd0-4128-96db-1f08afad7cdd') {
      setIsBogota(false);
      setciudadBogota('Bogotá D.C.');
    } else {
      setIsBogota(true);
      setciudadBogota('');
    }
  };
  const getListas = useCallback(
    async () => {
      const paises: any = localStorage.getItem('paises');
      const departamentos: any = localStorage.getItem('departamentos');
      const resp = await Promise.all([
        JSON.parse(departamentos),
        JSON.parse(paises),
        dominioService.get_type(ETipoDominio['Sitio de Defuncion']),
        dominioService.get_type(ETipoDominio['Area de Defuncion'])
      ]);
      const depart = JSON.parse(departamentos);
      let departamento = depart.filter(
        (i: { idDepartamento: string }) => i.idDepartamento == '31b870aa-6cd0-4128-96db-1f08afad7cdd'
      );

      const { idDepartamento } = departamento[0];
      const municipios = await dominioService.get_all_municipios_by_departamento(idDepartamento);
      setLMunicipios(municipios);

      setListas(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <>
      <p>Favor indique a continuación las opciones disponibles para el trámite de Licencia en Seguridad y Salud en el Trabajo!</p>
      <Form.Item
        label='Tipo de tramite'
        name='tipotramite'
        rules={[{ required: true }]}
      >
        <Radio.Group onChange={onChangeTipoTramite} >
          <Radio value='primera-vez'>Primera vez</Radio>
          <Radio value='modificacion'>Modificación</Radio>
          <Radio value='renovacion'>Renovación</Radio>
        </Radio.Group>
      </Form.Item>

      {getIsModificacion && (
        <>
          <Divider orientation='right'> Seleccione Motivo Modificación </Divider>
          <Form.Item
            label='Motivo de modificación'
            name='motivoModificacion'
            rules={[{ required: true }]}
          >
            <SelectComponent options={l_motivo_modificacion} optionPropkey='id' optionPropLabel='descripcion'  />
          </Form.Item>

          <Form.Item
            label='PDF Licencia Vigente a modificar'
            name='fileLicenciaAModificar'
            valuePropName='fileList'
             rules={[{ required: true }]}
            getValueFromEvent={normFile}
          >
            <Upload name='fileLicenciaAModificar'
                    maxCount={1} beforeUpload={() => false}
                    listType='text' accept='application/pdf'>
              <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label='Número de resolución vigente a la cual se le va a realizar la modificación'
            name='numeroResolucionModificacion'
            rules={[{ required: true, max: 50 }]}
          >
            <Input
              allowClear
              placeholder='Número de resolución'
              autoComplete='off'
              type='text'
            />
          </Form.Item>
          <Form.Item label='Fecha de resolución vigente a la cual se le va a realizar la modificación'
                     required={true}
                     name='fechaResolucionModificacion'>
            <DatepickerComponent
              picker='date'
              dateDisabledType='before'
              dateFormatType='default'
              placeholder='-- Elija una fecha --'
            />
          </Form.Item>

        </>
      )}

      {getIsRenovacion && (
        <>
          <Divider orientation='right'> Datos adicionales renovación  </Divider>

          <Form.Item
            label='Departamento'
            name='state'
            initialValue={obj?.state ? obj?.state : idDepartamentoBogota}
          >
            <SelectComponent
              options={l_departamentos_colombia}
              optionPropkey='idDepartamento'
              optionPropLabel='descripcion'
              onChange={onChangeDepartamento}
              disabled={true}
            />
          </Form.Item>

          <Form.Item
            label='Municipio'
            name='city'
            initialValue={obj?.city ? obj?.city : ciudadBogota}
            rules={[{ required: isBogota }]}
          >
            <SelectComponent
              options={l_municipios}
              value={ciudadBogota}
              searchValue={ciudadBogota}
              optionPropkey='idMunicipio'
              optionPropLabel='descripcion'
              disabled={!isBogota}
            />
          </Form.Item>

          <Form.Item
            label='PDF Licencia Anterior'
            name='fileLicenciaAnterior'
            valuePropName='fileList'
            rules={[{ required: true }]}
            getValueFromEvent={normFile}
          >
            <Upload name='fileLicenciaAnterior'
                    maxCount={1} beforeUpload={() => false}
                    listType='text' accept='application/pdf'>
              <Button icon={<UploadOutlined />}>Seleccionar archivo PDF</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label='Número de resolución de la licencia anterior'
            name='numeroResolucionAnterior'
            rules={[{ required: true, max: 50 }]}
          >
            <Input
              allowClear
              placeholder='Número de resolución'
              autoComplete='off'
              type='text'
            />
          </Form.Item>
          <Form.Item label='Fecha de resolución de la licencia anterior'
                     required={true}
                     name='fechaResolucionAnterior'>
            <DatepickerComponent
              picker='date'
              dateDisabledType='before'
              dateFormatType='default'
              placeholder='-- Elija una fecha --'
            />
          </Form.Item>
        </>
      )}
    </>
  );
}


interface ITipoTramiteProps<T> {
  form: FormInstance<T>;
  required: boolean;
  obj: any;
}
