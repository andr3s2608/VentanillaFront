import React, { useCallback, useEffect, useState } from 'react';

// Antd
import Form, { FormInstance } from 'antd/es/form';
import Radio, { RadioChangeEvent } from 'antd/es/radio';
import Input from 'antd/es/input';
import Divider from 'antd/es/divider';

// Utilidades
import { ITipoLicencia } from 'app/shared/utils/types.util';

// Componentes
import { SelectComponent } from 'app/shared/components/inputs/select.component';

// Servicios
import { dominioService, ETipoDominio, IDepartamento, IMunicipio, IDominio, ICementerio } from 'app/services/dominio.service';

export const CementerioInfoFormSeccion: React.FC<ICementerioInfoProps<any>> = (props) => {
  const { form, tipoLicencia } = props;

  //#region Listados

  const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
  const [[l_departamentos_colombia, l_cementerios, l_paises], setListas] = useState<[IDepartamento[], ICementerio[], IDominio[]]>(
    [[], [], []]
  );

  const getListas = useCallback(
    async () => {
      const resp = await Promise.all([
        dominioService.get_departamentos_colombia(),
        dominioService.get_cementerios_bogota(),
        dominioService.get_type(ETipoDominio.Pais)
      ]);
      setListas(resp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //#endregion
  //#region Acciones del formulario

  const [lugar, setLugar] = useState<TypeLugarCementerio>('Dentro de Bogotá');
  const onChangeLugarCementerio = (e: RadioChangeEvent) => {
    form.resetFields(['cementerioBogota', 'cementerioDepartamento', 'cementerioMunicipio', 'cementerioPais', 'cementerioCiudad']);
    setLMunicipios([]);
    setLugar(e.target.value);
  };

  const onChangeDepartamento = async (value: string) => {
    form.resetFields(['cementerioMunicipio']);
    const resp = await dominioService.get_municipios_by_departamento(value);
    setLMunicipios(resp);
  };

  //#endregion

  const renderForm = (_lugar: TypeLugarCementerio) => {
    switch (_lugar) {
      case 'Fuera de Bogotá':
        return (
          <div className='fadeInRight'>
            <Form.Item label='Departamento de Colombia' name='cementerioDepartamento' rules={[{ required: true }]}>
              <SelectComponent
                options={l_departamentos_colombia.filter((i) => i.descripcion !== 'BOGOTÁ D.C.')}
                optionPropkey='idDepartamento'
                optionPropLabel='descripcion'
                onChange={onChangeDepartamento}
              />
            </Form.Item>
            <Form.Item label='Municipio' name='cementerioMunicipio' rules={[{ required: true }]}>
              <SelectComponent options={l_municipios} optionPropkey='idMunicipio' optionPropLabel='descripcion' />
            </Form.Item>
          </div>
        );

      case 'Fuera del País':
        return (
          <div className='fadeInRight'>
            <Form.Item label='País' name='cementerioPais' rules={[{ required: true }]}>
              <SelectComponent
                options={l_paises.filter((i) => i.descripcion !== 'Colombia')}
                optionPropkey='id'
                optionPropLabel='descripcion'
              />
            </Form.Item>
            <Form.Item label='Ciudad' name='cementerioCiudad' rules={[{ required: true }]}>
              <Input allowClear placeholder='Ciudad' autoComplete='off' />
            </Form.Item>
          </div>
        );

      default:
        return (
          <Form.Item
            className='fadeInRight'
            label='Cementerio de Bogotá D.C.'
            name='cementerioBogota'
            rules={[{ required: true }]}
          >
            <SelectComponent options={l_cementerios} optionPropkey='NROIDENT' optionPropLabel='RAZON_S' />
          </Form.Item>
        );
    }
  };

  return (
    <>
      <Divider orientation='right'>Datos del Cementerio a realizar la {tipoLicencia}</Divider>

      <Form.Item
        className='mb-4'
        label='Lugar del cementerio'
        name='cementerioLugar'
        initialValue='Dentro de Bogotá'
        rules={[{ required: true }]}
      >
        <Radio.Group onChange={onChangeLugarCementerio}>
          <Radio value='Dentro de Bogotá'>Dentro de Bogotá</Radio>
          <br />
          <Radio value='Fuera de Bogotá'>Fuera de Bogotá</Radio>
          <br />
          <Radio value='Fuera del País'>Fuera del País</Radio>
        </Radio.Group>
      </Form.Item>

      {renderForm(lugar)}
    </>
  );
};

export const KeysForm = [
  'cementerioLugar',
  'cementerioBogota',
  'cementerioDepartamento',
  'cementerioMunicipio',
  'cementerioPais',
  'cementerioCiudad'
];

interface ICementerioInfoProps<T> extends ITipoLicencia {
  form: FormInstance<T>;
}

type TypeLugarCementerio = 'Dentro de Bogotá' | 'Fuera de Bogotá' | 'Fuera del País';
