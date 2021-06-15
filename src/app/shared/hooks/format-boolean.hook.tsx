import React from 'react';

export const useFormatBoolean = (texts?: { trueText?: string | React.ReactNode; falseText?: string | React.ReactNode }) => {
  const trueText = texts?.trueText || 'Si';
  const falseText = texts?.falseText || 'No';

  const format = (value?: boolean): string | React.ReactNode | undefined =>
    value !== undefined ? (value ? trueText : falseText) : undefined;
  const parser = (value?: string | moment.Moment): boolean | undefined => (value !== undefined ? value === trueText : undefined);

  return { format, parser };
};
