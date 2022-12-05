import React, {useCallback, useEffect, useState} from 'react';
import Form, {FormInstance} from 'antd/es/form';
import Radio, {RadioChangeEvent} from 'antd/es/radio';
import Input from 'antd/es/input';
import {SelectComponent} from '../../../../shared/components/inputs/select.component';
import {dominioService, ETipoDominio, IDepartamento, IDominio, IMunicipio} from '../../../../services/dominio.service';
import Divider from 'antd/es/divider';

export const DatosLaboralesFormSeccion: React.FC<IDatosLaboralesProps<any>> = (props) => {

  const { obj } = props;
  const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
  const [[l_departamentos_colombia, l_paises, l_sitio_defuncion, l_area_defuncion], setListas] = useState<
    [IDepartamento[], IDominio[], IDominio[], IDominio[]]
    >([[], [], [], []]);
  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [isColombia, setIsColombia] = useState(true);
  const [isBogota, setIsBogota] = useState(false);
  const [ciudadBogota, setciudadBogota] = useState<string>('Bogotá D.C.');
  const isLabora = false;
  const [getIsLabora, setIsLabora] = useState<boolean>(isLabora);

  const onChangeLabora = (e: RadioChangeEvent) => {

    setIsLabora(e.target.value === 'true-trabaja');

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
      <Form.Item
        label='¿Labora actualmente?'
        name='laboraActualmente'
        rules={[{ required: true }]}
      >
        <Radio.Group onChange={onChangeLabora}>
          <Radio value='true-trabaja'>Si</Radio>
          <Radio value='false-trabaja'>No</Radio>
        </Radio.Group>
      </Form.Item>

      {getIsLabora && (
        <>
          <Divider orientation='right'> Datos de la empresa </Divider>
          <Form.Item
            label='Nombre de la empresa'
            name='nombreEmpresa'
            rules={[{ required: true}]}
          >
            <Input
              allowClear
              placeholder='Nombre'
              autoComplete='off'
              type='text'
            />
          </Form.Item>
          <Form.Item
            label='Dirección de la empresa'
            name='direccionEmpresa'
            rules={[{ required: true}]}
          >
            <Input
              allowClear
              placeholder='Dirección'
              autoComplete='off'
              type='text'
            />
          </Form.Item>

          <Form.Item
            label='Departamento'
            name='state'
            initialValue={obj?.state ? obj?.state : idDepartamentoBogota}
            rules={[{ required: true}]}
          >
            <SelectComponent
              options={l_departamentos_colombia}
              optionPropkey='idDepartamento'
              optionPropLabel='descripcion'
              onChange={onChangeDepartamento}
            />
          </Form.Item>

          <Form.Item
            label='Municipio'
            name='city'
            initialValue={obj?.city ? obj?.city : ciudadBogota}
            rules={[{ required: true}]}
          >
            <SelectComponent
              options={l_municipios}
              value={ciudadBogota}
              searchValue={ciudadBogota}
              optionPropkey='idMunicipio'
              optionPropLabel='descripcion'
              //disabled={!isBogota}
            />
          </Form.Item>

          <Form.Item
            label='Teléfono de la empresa'
            name='telefonoEmpresa'
            rules={[{ required: false}]}
          >
            <Input
              allowClear
              placeholder='Teléfono'
              autoComplete='off'
              type='text'
            />
          </Form.Item>

          <Form.Item
          label='Fax de la empresa'
          name='faxEmpresa'
          rules={[{ required: false}]}
          >
          <Input
            allowClear
            placeholder='Fax'
            autoComplete='off'
            type='text'
          />
          </Form.Item>
        </>
      )}
    </>

  );
}

interface IDatosLaboralesProps<T> {
  form: FormInstance<T>;
  required: boolean;
  obj: any;
}
