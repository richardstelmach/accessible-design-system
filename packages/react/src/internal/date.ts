import { text } from './validation.js';

/** Supply this same id to DateInput. No DOM or React dependency is required. */
export function getDateInputIds(id: string) {
  text(id, 'DateInput id');
  if (/\s/.test(id)) throw new Error('OwlA11y: DateInput id must not contain whitespace.');
  return { group: id, day: `${id}-day`, month: `${id}-month`, year: `${id}-year` };
}
