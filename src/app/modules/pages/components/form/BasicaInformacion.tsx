import Form from "antd/es/form";
import Input from "antd/es/input";
import { dominioService, ETipoDominio, IDominio } from "app/services/dominio.service";
import { SelectComponent } from "app/shared/components/inputs/select.component";
import { useStepperForm } from "app/shared/hooks/stepper.hook";
import { layoutItems } from "app/shared/utils/form-layout.util";
import React, { useCallback, useEffect, useState } from "react";


export const BasicaInformacion: React.FC<any> = (props) => {
    const [form] = Form.useForm<any>();
    const { current, setCurrent, status, setStatus, onNextStep, onPrevStep } = useStepperForm<any>(form);
    const [l_tipos_documento, setListaTipoDocumento] = useState<IDominio[]>([]);

    const getListas = useCallback(
        async () => {
            const resp = await dominioService.get_type(ETipoDominio['Tipo Documento']);
            setListaTipoDocumento(resp);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        getListas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const defaultValues = {
        identity: '7c96a4d3-a0cb-484e-a01b-93bc39c2552e',
        identification: ''
    };

    return (
        <>
            <Form.Item label='Número de Identificación' name='IDNumber' rules={[{ required: true, max: 25 }]}>
                <Input allowClear placeholder='Número de Identificación' autoComplete='off' />
            </Form.Item>

            <Form.Item label='Primer Nombre' name='name' rules={[{ required: true }]}>
                <Input allowClear placeholder='Primer Nombre' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Segundo Nombre' name='secondName'>
                <Input allowClear placeholder='Segundo Nombre' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Primer Apellido' name='surname' rules={[{ required: true }]}>
                <Input allowClear placeholder='Primer Apellido' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Segundo Apellido' name='secondSurname'>
                <Input allowClear placeholder='Segundo Apellido' autoComplete='off' />
            </Form.Item>

            <Form.Item
                label='Tipo Identificación'
                initialValue={defaultValues.identity}
                name='instTipoIdent'
                rules={[{ required: true }]}
            >
                <SelectComponent options={l_tipos_documento} optionPropkey='id' optionPropLabel='descripcion' />
            </Form.Item>

            <Form.Item
                label='Número Identificación'
                initialValue={defaultValues.identification}
                name='instNumIdent'
                rules={[{ required: true }]}
            >
                <Input allowClear type='tel' placeholder='Número Identificación' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Telefono Fijo' name='phone'>
                <Input allowClear placeholder='Telefono Fijo' type="number" autoComplete='off' />
            </Form.Item>
            <Form.Item label='Telefono Celular' name='phonecell' rules={[{ required: true }]}>
                <Input allowClear placeholder='Telefono Celular' type="number" autoComplete='off' />
            </Form.Item>
            <Form.Item label='Correo electronico' name='email' rules={[{ required: true, type: 'email' }]}>
                <Input allowClear placeholder='email@exaple.com' autoComplete='off' />
            </Form.Item>
            <Form.Item label='Confirmar Correo Electronico' name='confirEmail' rules={[{ required: true, type: 'email' }]}>
                <Input allowClear placeholder='email@exaple.com' autoComplete='off' />
            </Form.Item>
        </>

    );
}