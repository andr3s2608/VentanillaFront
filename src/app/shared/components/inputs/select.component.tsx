import React from 'react';

// Antd
import Select, { SelectProps } from 'antd/es/select';

export const SelectComponent: React.FC<ISelectProps> = (props) => {
  const { options, optionPropLabel, optionPropkey, showKeyInLabel = false, toUppercase = true, ...selectProps } = props;
  return (
    <Select showSearch placeholder='-- Elija una opción --' optionFilterProp='children' allowClear {...selectProps}>
      {!!selectProps.children
        ? selectProps.children
        : options?.map((i: any, idx: number) => {
            const _optionName = !!optionPropLabel ? `${i[optionPropLabel]}` : undefined;
            const _optionLabel: string = !!_optionName
              ? showKeyInLabel
                ? `${i[optionPropkey]} - ${_optionName}`
                : _optionName
              : `${i[optionPropkey]}`;

            const __optionLabel = !!toUppercase ? _optionLabel.toUpperCase() : _optionLabel;

            return (
              <Select.Option key={idx} value={i[optionPropkey]} title={__optionLabel} name={_optionName}>
                {__optionLabel}
              </Select.Option>
            );
          })}
    </Select>
  );
};

interface ISelectProps extends SelectProps<any> {
  options: any[];
  optionPropLabel?: string;
  optionPropkey: string | number;
  showKeyInLabel?: boolean;
  toUppercase?: boolean;
}
