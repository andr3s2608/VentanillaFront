import moment, { Moment } from 'moment-timezone';

export type TypeDateFormat = 'default' | 'dateTime' | 'dateTimes' | 'month' | 'week' | 'time' | 'times' | 'year';

const dateFormat = {
  default: 'DD-MM-YYYY',
  dateTime: 'DD-MM-YYYY HH:mm',
  dateTimes: 'DD-MM-YYYY HH:mm:ss',
  month: 'MM-YYYY',
  week: 'WW-YYYY',
  time: 'HH:mm',
  times: 'HH:mm:ss',
  year: 'YYYY'
};

const timeInDatePicker = { format: 'HH:mm', use12Hours: false, minuteStep: 5 };

const timeZone = 'America/Bogota';
const today = moment().tz(timeZone);
const yesterday = moment().tz(timeZone).subtract(1, 'd');
const tomorrow = moment().tz(timeZone).add(1, 'd');

const period = (timeOf: moment.unitOfTime.StartOf): Moment[] => [moment().startOf(timeOf), moment().endOf(timeOf)];

const [startWeek, endWeek] = period('isoWeek');
const [startMonth, endMonth] = period('month');
const [startYear, endYear] = period('year');

export type TypeDatePeriod =
  | 'default'
  | 'after'
  | 'afterYesterday'
  | 'afterTomorrow'
  | 'before'
  | 'beforeYesterday'
  | 'beforeTomorrow';

const dateDisabled = {
  default: undefined,
  after: (date: Moment) => date < today.clone().startOf('day'),
  afterYesterday: (date: Moment) => date < yesterday.clone().startOf('day'),
  afterTomorrow: (date: Moment) => date < tomorrow.clone().startOf('day'),
  before: (date: Moment) => date > today.clone().endOf('day'),
  beforeYesterday: (date: Moment) => date > yesterday.clone().endOf('day'),
  beforeTomorrow: (date: Moment) => date > tomorrow.clone().endOf('day')
};

const Hoy = [today, today];

const dateRange = {
  default: {
    Hoy,
    'Esta semana': [startWeek, endWeek],
    'Este mes': [startMonth, endMonth],
    'Este año': [startYear, endYear]
  },
  after: {
    Hoy,
    'Esta semana': [today, endWeek],
    'Este mes': [today, endMonth],
    'Este año': [today, endYear]
  },
  afterYesterday: {
    Hoy,
    'Esta semana': [yesterday, endWeek],
    'Este mes': [yesterday, endMonth],
    'Este año': [yesterday, endYear]
  },
  afterTomorrow: {
    Mañana: [tomorrow, tomorrow],
    'Esta semana': [tomorrow, endWeek],
    'Este mes': [tomorrow, endMonth],
    'Este año': [tomorrow, endYear]
  },
  before: {
    Hoy,
    'Esta semana': [startWeek, today],
    'Este mes': [startMonth, today],
    'Este año': [startYear, today]
  },
  beforeYesterday: {
    Ayer: [yesterday, yesterday],
    'Esta semana': [startWeek, yesterday],
    'Este mes': [startMonth, yesterday],
    'Este año': [startYear, yesterday]
  },
  beforeTomorrow: {
    Hoy,
    'Esta semana': [startWeek, tomorrow],
    'Este mes': [startMonth, tomorrow],
    'Este año': [startYear, tomorrow]
  }
};

export { dateFormat, dateDisabled, dateRange, timeInDatePicker };
