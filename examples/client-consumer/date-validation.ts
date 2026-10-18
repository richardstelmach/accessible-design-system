import type { DateInputProps, DateInputValue, DatePart, FieldError } from '@owla11y/react';

export type DateValidation = Pick<Extract<DateInputProps, { errorAssociation?: 'group' }>, 'errorAssociation' | 'invalidParts' | 'error'> |
  { errorAssociation: 'children'; invalidParts: readonly [DatePart, ...DatePart[]]; error: FieldError };

// Example service policy, deliberately outside the component/package API.
// Called only at submission: do not normalise or validate on each keystroke.
export function validateBirthDate(value: DateInputValue, required = true, today = new Date()): DateValidation {
  const parts: DatePart[] = ['day', 'month', 'year'];
  const values = parts.map(part => value[part].trim());
  const group = (message: string): DateValidation => ({ errorAssociation: 'group', error: { message } });
  const child = (invalidParts: DatePart[], message: string): DateValidation => ({ errorAssociation: 'children', invalidParts: invalidParts as [DatePart, ...DatePart[]], error: { message } });
  if (values.every(v => v === '')) return required ? group('Enter your date of birth.') : {};
  const missing = parts.filter(part => !value[part].trim());
  if (missing.length) return child(missing, `Date of birth must include ${missing.length === 1 ? 'a ' : ''}${missing.join(' and ')}.`);
  const malformed = parts.filter(part => !(part === 'year' ? /^\d{4}$/ : /^\d{1,2}$/).test(value[part].trim()));
  if (malformed.length) return child(malformed, 'Use 1 or 2 digits for day and month and 4 digits for year.');
  const [day, month, year] = values.map(Number);
  if (month < 1 || month > 12) return child(['month'], 'Month must be between 1 and 12.');
  if (day < 1 || day > 31) return child(['day'], 'Day must be between 1 and 31.');
  if (year < 1) return child(['year'], 'Year must be greater than zero.');
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day > daysInMonth[month - 1]) return group('Enter a real date of birth.');
  const dateKey = year * 10000 + month * 100 + day;
  const todayKey = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  if (dateKey >= todayKey) return group('Date of birth must be in the past.');
  return {};
}
