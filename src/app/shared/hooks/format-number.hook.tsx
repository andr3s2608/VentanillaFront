export const useFormatNumber = () => {
  const format = (value?: number, options?: { prefix?: string; suffix?: string; toFixed?: number }): string => {
    if (!!value) {
      const prefix = options?.prefix || '';
      const suffix = options?.suffix || '';

      const _value = options?.toFixed !== undefined ? Number(value).toFixed(options.toFixed) : value;
      const _valueArr = `${_value}`.split(/[.,]+/g);
      const _valueInt = _valueArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      const _valueMask = `${_valueInt}${!!_valueArr[1] ? `,${_valueArr[1]}` : ''}`;

      return `${prefix}${_valueMask}${suffix}`;
    }

    return '';
  };

  const parser = (value?: string): number => {
    if (!!value) {
      const _valueArr = `${value}`.split(',');
      const _valueInt = _valueArr[0].replace(/[^-0-9,]/g, '');
      const _valueUnMask = `${_valueInt}${!!_valueArr[1] ? `.${_valueArr[1]}` : ''}`;

      return Number(_valueUnMask);
    }

    return 0;
  };

  return { format, parser };
};
