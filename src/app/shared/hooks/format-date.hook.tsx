import moment from 'moment';

// Utilidades
import { dateFormat } from 'app/shared/utils/datePicker.util';

export const useFormatDate = (formats?: { formatIn?: string; formatOut?: string }) => {
  const formatIn = formats?.formatIn || dateFormat.default;
  const formatOut = formats?.formatOut || dateFormat.default;

  const format = (value?: string | moment.Moment): string | undefined =>
    !!value ? moment(value, formatIn).format(formatOut) : undefined;

  const parser = (value?: string | moment.Moment): string | undefined =>
    !!value ? moment(value, formatOut).format(formatIn) : undefined;

  return { format, parser };
};
