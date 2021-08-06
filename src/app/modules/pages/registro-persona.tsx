// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';

// Utilidades
import { projectInfo } from 'app/shared/utils/constants.util';
import { authProvider } from 'app/shared/utils/authprovider.util';
import Form from 'antd/es/form';
import { layoutItems, layoutWrapper } from 'app/shared/utils/form-layout.util';
import { BasicaInformacion } from './components/form/BasicaInformacion';
import { SelectComponent } from 'app/shared/components/inputs/select.component';
import React, { useCallback, useEffect, useState } from 'react';
import { dominioService, ETipoDominio, IDepartamento, IDominio, IMunicipio } from 'app/services/dominio.service';
import Tabs from 'antd/es/tabs';
import Alert from 'antd/es/alert';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import { useHistory } from 'react-router';



const { TabPane } = Tabs;


const RegistroPage: React.FC<any> = (props) => {
    const history = useHistory();
    const { name, userName } = authProvider.getAccount();
    const [form] = Form.useForm<any>();
    const [isColombia, setIsColombia] = useState(true);

    const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
    const [[l_departamentos_colombia, l_paises,], setListas] = useState<
        [IDepartamento[], IDominio[]]
    >([[], []]);

    const idColombia = '1e05f64f-5e41-4252-862c-5505dbc3931c';
    const idDepartamentoBogota = '31b870aa-6cd0-4128-96db-1f08afad7cdd';
    const getListas = useCallback(
        async () => {
            const [municipios, ...resp] = await Promise.all([
                dominioService.get_municipios_by_departamento(idDepartamentoBogota),
                dominioService.get_departamentos_colombia(),
                dominioService.get_type(ETipoDominio.Pais)
            ]);
            setLMunicipios(municipios);
            setListas(resp);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const onChangePais = (value: string) => {
        setIsColombia(value === idColombia);
        props.form.setFieldsValue({ state: undefined, city: undefined });
    };
    const onChangeDepartamento = async (value: string) => {
        props.form.setFieldsValue({ city: undefined });
        const resp = await dominioService.get_municipios_by_departamento(value);
        setLMunicipios(resp);
    };

    useEffect(() => {
        getListas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const goBack = () => {
        history.goBack();
    }
    const onSubmit = () => { }
    const onSubmitFailed = () => { }
    return (
        <div className='fadeInTop container-fluid'>
            <PageHeaderComponent
                title={`Registro Persona Natural.`}
                subTitle={`Por favor registre los datos exactamente como aparecen en su documento de identidad, estos datos seran usados para la generaciòn de los Documentos asociados al trámite solicitado y su posterior reporte a entidades de vigilancia y control.`}
                backIcon={null}
            />

            <div className='card card-body'>
                <h4 className='app-subtitle mt-3'>Datos Básicos.</h4>

                <Form
                    form={form}
                    className='mb-4 w-100'
                    {...layoutItems}
                    style={{ maxWidth: 800 }}
                    layout='horizontal'
                    onFinish={onSubmit}
                    onFinishFailed={onSubmitFailed}>

                    <BasicaInformacion form={form} />
                    <h4 className='app-subtitle mt-3'>Datos Geográficos.</h4>
                    <Form.Item label='País' name='country' initialValue={idColombia} rules={[{ required: true }]}>
                        <SelectComponent options={l_paises} optionPropkey='id' optionPropLabel='descripcion' onChange={onChangePais} />
                    </Form.Item>

                    <Form.Item
                        label='Departamento Defunción'
                        name='state'
                        initialValue={idDepartamentoBogota}
                        rules={[{ required: isColombia }]}
                    >
                        <SelectComponent
                            options={l_departamentos_colombia}
                            optionPropkey='idDepartamento'
                            optionPropLabel='descripcion'
                            onChange={onChangeDepartamento}
                            disabled={!isColombia}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Municipio Defunción'
                        name='city'
                        initialValue='31211657-3386-420a-8620-f9c07a8ca491'
                        rules={[{ required: isColombia }]}
                    >
                        <SelectComponent
                            options={l_municipios}
                            optionPropkey='idMunicipio'
                            optionPropLabel='descripcion'
                            disabled={!isColombia}
                        />
                    </Form.Item>
                    <Alert
                        message="Información!"
                        description="Por favor registre su dirección de residencia tal como aparece en el recibo público,
                                en las casillas indicadas para esto. Una vez completado los datos, favor dar clic sobre el botón verde Confirmar Dirección.
                                Esta funcionalidad permitirá autocompletar datos de UPZ, Localidad y Barrio para las direcciones de Bogotá D.C. y
                                estandarizar la dirección para el resto de ciudades."
                        type="info"
                    />

                    <h4 className='app-subtitle mt-3'>Datos Demográficos.</h4>
                    <Form.Item label='Número de Identificación' name='IDNumber' rules={[{ required: true, max: 25 }]}>
                        <Input allowClear placeholder='Número de Identificación' autoComplete='off' />
                    </Form.Item>

                    <Form.Item
                        label='Sexo'
                        name='sex'
                        initialValue={idDepartamentoBogota}
                        rules={[{ required: isColombia }]}
                    >
                        <SelectComponent
                            options={l_departamentos_colombia}
                            optionPropkey='idDepartamento'
                            optionPropLabel='descripcion'
                            onChange={onChangeDepartamento}
                            disabled={!isColombia}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Genero'
                        name='gender'
                        initialValue={idDepartamentoBogota}
                        rules={[{ required: isColombia }]}
                    >
                        <SelectComponent
                            options={l_departamentos_colombia}
                            optionPropkey='idDepartamento'
                            optionPropLabel='descripcion'
                            onChange={onChangeDepartamento}
                            disabled={!isColombia}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Orientacion sexual'
                        name='sexual_orientation'
                        initialValue={idDepartamentoBogota}
                        rules={[{ required: isColombia }]}
                    >
                        <SelectComponent
                            options={l_departamentos_colombia}
                            optionPropkey='idDepartamento'
                            optionPropLabel='descripcion'
                            onChange={onChangeDepartamento}
                            disabled={!isColombia}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Etnia'
                        name='ethnicity'
                        initialValue={idDepartamentoBogota}
                        rules={[{ required: isColombia }]}
                    >
                        <SelectComponent
                            options={l_departamentos_colombia}
                            optionPropkey='idDepartamento'
                            optionPropLabel='descripcion'
                            onChange={onChangeDepartamento}
                            disabled={!isColombia}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Estado Civil'
                        name='ethnicity'
                        initialValue={idDepartamentoBogota}
                        rules={[{ required: isColombia }]}
                    >
                        <SelectComponent
                            options={l_departamentos_colombia}
                            optionPropkey='idDepartamento'
                            optionPropLabel='descripcion'
                            onChange={onChangeDepartamento}
                            disabled={!isColombia}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Nivel Educativo'
                        name='levelEducation'
                        initialValue={idDepartamentoBogota}
                        rules={[{ required: isColombia }]}
                    >
                        <SelectComponent
                            options={l_departamentos_colombia}
                            optionPropkey='idDepartamento'
                            optionPropLabel='descripcion'
                            onChange={onChangeDepartamento}
                            disabled={!isColombia}
                        />
                    </Form.Item>

                    <Form.Item {...layoutWrapper} className='mb-0 mt-4'>
                        <div className='d-flex justify-content-between'>
                            <Button type='dashed' htmlType='button' onClick={goBack}>
                                Volver atrás
                            </Button>
                            <Button type='primary' htmlType='submit'>
                                Guardar
                            </Button>
                        </div>
                    </Form.Item>
                </Form>




            </div>
        </div>
    );
};

export default RegistroPage;
