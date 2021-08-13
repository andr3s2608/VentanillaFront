// Componentes
import { PageHeaderComponent } from 'app/shared/components/page-header.component';

// Utilidades
import { direcionOrienta, nomesclatura, projectInfo } from 'app/shared/utils/constants.util';
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
import { ApiService } from 'app/services/Apis.service';



const { TabPane } = Tabs;


const RegistroPage: React.FC<any> = (props) => {
    const history = useHistory();
    const { name, userName } = authProvider.getAccount();
    const [form] = Form.useForm<any>();
    const [isColombia, setIsColombia] = useState(true);
    const [sex, setSex] = useState<[]>([]);
    const [etniastate, setEtnia] = useState<[]>([]);
    const [l_municipios, setLMunicipios] = useState<IMunicipio[]>([]);
    const [[l_departamentos_colombia, l_paises,], setListas] = useState<
        [IDepartamento[], IDominio[]]
    >([[], []]);

    const { accountIdentifier } = authProvider.getAccount();
    const api = new ApiService(accountIdentifier);

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

    const getListas2 = useCallback(

        async () => {
            const [etnia, sexo] = await Promise.all([
                api.GetEtnia(),
                api.GetSexo()
            ]);
            setEtnia(etnia);
            setSex(sexo);
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
        getListas2();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const goBack = () => {
        history.goBack();
    }

    const onSubmit = async (value: any) => {

        const { confirEmail, email } = value;

        if (confirEmail === email) {
            const { ppla, Num1, letra1, Bis, card1, Num2, letra2, placa, card2 } = value;
            const direcion = `${ppla} ${Num1} ${letra1} ${Bis} ${card1} ${Num2} ${letra2} ${placa} ${card2}`;
            const data = {
                primerNombre: value.name,
                segundoNombre: value.secondName,
                primerApellido: value.surname,
                segundoApellido: value.secondSurname,
                tipoDocumento: value.instTipoIdent, //listado tipos de documentos
                numeroIdentificacion: value.instNumIdent,
                telefonoFijo: value.phone,
                telefonoCelular: value.phonecell,
                email: value.email,
                nacionalidad: value.country, //listado de paises
                departamento: value.state, //listado de departamentos
                ciudadNacimientoOtro: null,
                ciudadNacimiento: null, //listado municipios
                departamentoResidencia: null, //listado departamentos
                ciudadResidencia: null, //listado municipios
                direccionResidencia: direcion,
                fechaNacimiento: null,
                sexo: value.sex, //listado sexo
                genero: value.gender, //lista quemada
                orientacionSexual: value.sexual_orientation, //lista quemada
                etnia: value.ethnicity, //listado etnia
                estadoCivil: value.estadoCivil, //lista quemada
                nivelEducativo: value.levelEducation //listado nivel educativo

            };

            await api.personaNatural(data);

        }

    }

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

                    <Form.Item
                        label='Via Ppla'
                        name='ppla'
                        rules={[{ required: true }]}
                    >
                        <SelectComponent
                            options={nomesclatura}
                            optionPropkey='key'
                            optionPropLabel='value'
                        />
                    </Form.Item>

                    <Form.Item
                        label='Num'
                        name='Num1'
                        rules={[{ required: true }]}
                    >
                        <Input allowClear placeholder='' autoComplete='off' />
                    </Form.Item>

                    <Form.Item
                        label='letra'
                        name='letra1'
                    >
                        <SelectComponent
                            options={nomesclatura}
                            optionPropkey='key'
                            optionPropLabel='value'
                        />
                    </Form.Item>

                    <Form.Item
                        label='Bis'
                        name='Bis'
                    >
                        <SelectComponent
                            options={[{ key: 'Bis', value: 'Bis' }]}
                            optionPropkey='key'
                            optionPropLabel='value'
                        />
                    </Form.Item>

                    <Form.Item
                        label='Card'
                        name='card1'
                    >
                        <SelectComponent
                            options={direcionOrienta}
                            optionPropkey='key'
                            optionPropLabel='value'
                        />
                    </Form.Item>
                    <Form.Item
                        label='Num'
                        name='Num2'
                        rules={[{ required: true }]}
                    >
                        <Input allowClear placeholder='' autoComplete='off' />
                    </Form.Item>

                    <Form.Item
                        label='letra'
                        name='letra2'
                    >
                        <SelectComponent
                            options={nomesclatura}
                            optionPropkey='key'
                            optionPropLabel='value'
                        />
                    </Form.Item>

                    <Form.Item
                        label='Placa'
                        name='placa'
                        rules={[{ required: true }]}
                    >
                        <Input allowClear placeholder='' autoComplete='off' />
                    </Form.Item>

                    <Form.Item
                        label='Card'
                        name='card2'
                    >
                        <SelectComponent
                            options={direcionOrienta}
                            optionPropkey='key'
                            optionPropLabel='value'
                        />
                    </Form.Item>

                    <h4 className='app-subtitle mt-3'>Datos Demográficos.</h4>
                    <Form.Item label='Número de Identificación' name='IDNumber' rules={[{ required: true, max: 25 }]}>
                        <Input allowClear placeholder='Número de Identificación' autoComplete='off' />
                    </Form.Item>



                    <Form.Item
                        label='Sexo'
                        name='sex'

                        rules={[{ required: true }]}
                    >
                        <SelectComponent
                            options={sex}
                            optionPropkey='descripcionSexo'
                            optionPropLabel='descripcionSexo'
                            disabled={!isColombia}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Genero'
                        name='gender'
                        rules={[{ required: true }]}
                    >
                        <SelectComponent
                            options={sex}
                            optionPropkey='descripcionSexo'
                            optionPropLabel='descripcionSexo'
                            disabled={!isColombia}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Orientacion sexual'
                        name='sexual_orientation'
                        rules={[{ required: true }]}
                    >
                        <SelectComponent
                            options={sex}
                            optionPropkey='descripcionSexo'
                            optionPropLabel='descripcionSexo'
                            disabled={!isColombia}
                        />
                    </Form.Item>

                    <Form.Item
                        label='Etnia'
                        name='ethnicity'
                        rules={[{ required: true }]}
                    >
                        <SelectComponent
                            options={etniastate}
                            optionPropkey='nombre'
                            optionPropLabel='nombre'
                            disabled={!isColombia}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Estado Civil'
                        name='estadoCivil'
                        initialValue={idDepartamentoBogota}
                        rules={[{ required: isColombia }]}
                    >
                        <SelectComponent
                            options={l_departamentos_colombia}
                            optionPropkey='idDepartamento'
                            optionPropLabel='descripcion'
                            disabled={!isColombia}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Nivel Educativo'
                        name='levelEducation'
                        rules={[{ required: true }]}
                    >
                        <SelectComponent
                            options={[]}
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
