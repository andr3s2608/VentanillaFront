import React from 'react';
import { Moment } from 'moment';

// Antd
import { RangePickerBaseProps, RangePickerDateProps, RangePickerTimeProps } from 'antd/es/date-picker/generatePicker';
import DatePicker from 'antd/es/date-picker';

// Utils
import {
  dateRange,
  dateFormat,
  dateDisabled,
  TypeDatePeriod,
  TypeDateFormat,
  timeInDatePicker as showTime
} from 'app/shared/utils/datePicker.util';

export const RangepickerComponent: React.FC<TypeRangePickerProps<Moment>> = (props) => {
  const { dateShowTime = false, dateFormatType = 'default', dateDisabledType = 'default', ...rangePickerProps } = props;

  const onRangeDisabled = dateDisabled[dateDisabledType];
  const onRangePicker: any = dateRange[dateDisabledType];
  const onRangeFormat = dateFormat[dateFormatType];
  const onShowTime = dateShowTime
    ? !rangePickerProps.picker || rangePickerProps.picker === 'date'
      ? { showTime }
      : undefined
    : {};

  return (
    <DatePicker.RangePicker
      disabledDate={onRangeDisabled}
      format={onRangeFormat}
      ranges={onRangePicker}
      {...onShowTime}
      {...rangePickerProps}
    />
  );
};

interface IRangePickerBaseProps {
  dateShowTime?: boolean;
  dateFormatType?: TypeDateFormat;
  dateDisabledType?: TypeDatePeriod;
}

type TypeRangePickerProps<T> =
  | (IRangePickerBaseProps & RangePickerBaseProps<T>)
  | (IRangePickerBaseProps & RangePickerDateProps<T>)
  | (IRangePickerBaseProps & RangePickerTimeProps<T>);
