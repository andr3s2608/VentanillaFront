import React from 'react';
import { Moment } from 'moment';

// Antd
import { PickerBaseProps, PickerDateProps, PickerTimeProps } from 'antd/es/date-picker/generatePicker';
import DatePicker from 'antd/es/date-picker';

// Utils
import {
  dateDisabled,
  dateFormat,
  TypeDatePeriod,
  TypeDateFormat,
  timeInDatePicker as showTime
} from 'app/shared/utils/datePicker.util';

export const DatepickerComponent: React.FC<TypePickerBaseProps<Moment>> = (props) => {
  const {
    dateShowTime = false,
    dateFormatType = 'default',
    dateDisabledType = 'default',
    placeholder,
    ...datepickerProps
  } = props;

  const onDateDisabled = dateDisabled[dateDisabledType];
  const onDateFormat = dateFormat[dateFormatType];
  const onShowTime = dateShowTime
    ? !datepickerProps.picker || datepickerProps.picker === 'date'
      ? { showTime }
      : undefined
    : {};
  const placeholderName = placeholder ?? '-- Elija una fecha --';
  return (
    <DatePicker
      placeholder={placeholderName}
      disabledDate={onDateDisabled}
      format={onDateFormat}
      {...onShowTime}
      {...datepickerProps}
    />
  );
};

interface IDatepickerComponent {
  dateShowTime?: boolean;
  dateFormatType?: TypeDateFormat;
  dateDisabledType?: TypeDatePeriod;
  placeholder?: string;
}

type TypePickerBaseProps<T> =
  | (IDatepickerComponent & PickerBaseProps<T>)
  | (IDatepickerComponent & PickerDateProps<T>)
  | (IDatepickerComponent & PickerTimeProps<T>);
