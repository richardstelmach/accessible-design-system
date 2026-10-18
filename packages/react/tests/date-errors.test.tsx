import React, { act, createRef, useState } from 'react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import axe from 'axe-core';
import { DateInput, ErrorSummary, getDateInputIds, TextInput } from '../src/index.js';
import type { DateInputValue } from '../src/index.js';
import { validateBirthDate } from '../../../examples/client-consumer/date-validation.js';

// jsdom has no layout/scroll engine. Native layout and visibility are checked in Chromium.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([new DOMRect(0, 0, 100, 40)] as unknown as DOMRectList);
  HTMLElement.prototype.scrollIntoView ??= () => {};
  vi.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('compound dates', () => {
  it('demonstrates real calendar validation only at an explicit service boundary', () => {
    const date = (day: string, month: string, year: string) => validateBirthDate({ day, month, year }, true, new Date(2026, 9, 18));
    expect(date('29', '2', '2000').error).toBeUndefined();
    expect(date('29', '2', '1900').error?.message).toBe('Enter a real date of birth.');
    expect(date('31', '4', '2000').errorAssociation).toBe('group');
    expect(date('1', '13', '2000').invalidParts).toEqual(['month']);
    expect(date('1', '2', '').invalidParts).toEqual(['year']);
    expect(date('19', '10', '2026').error?.message).toBe('Date of birth must be in the past.');
    expect(validateBirthDate({ day: '', month: '', year: '' }, false)).toEqual({});
  });
  it('uses one native fieldset and stable labelled text parts with birthday purpose', () => {
    const ref = createRef<HTMLInputElement>();
    render(<DateInput ref={ref} id="dob" legend="Date of birth" name="dob" helperText="For example, 31 3 1980." purpose="date-of-birth" />);
    const group = screen.getByRole('group', { name: 'Date of birth' });
    expect(group.firstElementChild?.tagName).toBe('LEGEND'); expect(group).not.toHaveAttribute('required');
    expect(group).toHaveAccessibleDescription('For example, 31 3 1980.');
    expect(ref.current).toBe(screen.getByLabelText('Day'));
    const ids = getDateInputIds('dob');
    for (const part of ['day', 'month', 'year'] as const) {
      const input = document.getElementById(ids[part]);
      expect(input).toHaveAttribute('name', `dob-${part}`); expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('inputmode', 'numeric'); expect(input).toHaveAttribute('autocomplete', `bday-${part}`);
      expect(input).toBeRequired(); expect(input).not.toHaveAttribute('maxlength'); expect(input).not.toHaveAttribute('placeholder');
    }
  });

  it('preserves raw controlled strings without padding, clamping, parsing or advancing focus', async () => {
    const events: DateInputValue[] = [];
    function Controlled() { const [value, setValue] = useState({ day: '', month: '', year: '' });
      return <DateInput legend="Date" name="date" value={value} onValueChange={next => { events.push(next); setValue(next); }} />; }
    render(<Controlled />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Day'), '009'); expect(screen.getByLabelText('Day')).toHaveFocus();
    await user.type(screen.getByLabelText('Month'), '13'); await user.type(screen.getByLabelText('Year'), '20x0');
    expect(events.at(-1)).toEqual({ day: '009', month: '13', year: '20x0' });
    expect(screen.getByLabelText('Day')).toHaveValue('009');
  });

  it('supports native uncontrolled reset, custom submission names and localised optional labels', async () => {
    render(<form data-testid="form"><DateInput legend="Previous date" name="previous" required={false} optionalLabel="(facultatif)"
      labels={{ day: 'Jour', month: 'Mois', year: 'Année' }} partNames={{ day: 'd', month: 'm', year: 'y' }}
      defaultValue={{ day: '01', month: '02', year: '2000' }} /><button type="reset">Reset</button></form>);
    expect(screen.getByRole('group')).toHaveAccessibleName('Previous date (facultatif)');
    expect(screen.getByLabelText('Jour')).not.toBeRequired(); expect(screen.getByLabelText('Jour')).not.toHaveAttribute('autocomplete');
    await userEvent.setup().type(screen.getByLabelText('Année'), 'x');
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(new FormData(form).get('y')).toBe('2000x');
    await userEvent.setup().click(screen.getByText('Reset')); expect(screen.getByLabelText('Année')).toHaveValue('2000');
  });

  it('keeps group and child errors mutually exclusive while preserving all values', () => {
    const value = { day: '31', month: '13', year: '2000' };
    const { rerender } = render(<DateInput id="date" legend="Date" name="date" defaultValue={value} helperText="Use numbers"
      error={{ message: 'Error: Enter a real date.' }} />);
    expect(screen.getByRole('group')).toHaveAccessibleDescription('Use numbers Error: Enter a real date.');
    for (const label of ['Day', 'Month', 'Year']) expect(screen.getByLabelText(label)).not.toHaveAttribute('aria-invalid');
    rerender(<DateInput id="date" legend="Date" name="date" defaultValue={value} helperText="Use numbers"
      error={{ message: 'Error: Check the month and year.' }} errorAssociation="children" invalidParts={['month', 'year']} />);
    expect(screen.getByRole('group')).toHaveAccessibleDescription('Use numbers');
    expect(screen.getByRole('group')).not.toHaveAttribute('aria-invalid');
    expect(screen.getByLabelText('Day')).not.toHaveAttribute('aria-describedby');
    for (const label of ['Month', 'Year']) {
      expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText(label)).toHaveAccessibleDescription('Error: Check the month and year.');
    }
    expect(screen.getAllByText('Error: Check the month and year.')).toHaveLength(1);
    expect(screen.getByLabelText('Month')).toHaveValue('13');
  });

  it('forwards an explicit form owner to all three native date controls', () => {
    render(<><form id="external" data-testid="external" /><DateInput form="external" legend="Date" name="date" defaultValue={{ day: '1', month: '2', year: '2000' }} /></>);
    const data = new FormData(screen.getByTestId('external') as HTMLFormElement);
    expect([...data]).toEqual([['date-day', '1'], ['date-month', '2'], ['date-year', '2000']]);
  });

  it('distinguishes whole-date disabled and read-only submission and suppresses stale errors', () => {
    render(<form data-testid="form"><DateInput legend="Unavailable" name="unavailable" disabled defaultValue={{ day: '1', month: '2', year: '2000' }} error={{ message: 'Hidden disabled error' }} />
      <DateInput legend="Saved" name="saved" readOnly value={{ day: '3', month: '4', year: '2001' }} error={{ message: 'Hidden readonly error' }} /></form>);
    const groups = screen.getAllByRole('group');
    expect(groups[0].querySelector('input')).toBeDisabled();
    expect(groups[1].querySelector('input')).toHaveAttribute('readonly');
    expect(screen.queryByText(/Hidden/)).not.toBeInTheDocument();
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.has('unavailable-day')).toBe(false); expect(data.get('saved-year')).toBe('2001');
  });

  it('rejects ambiguous value/error ownership and invalid part configuration', () => {
    expect(() => getDateInputIds('bad id')).toThrow('whitespace');
    expect(() => renderToString(React.createElement(DateInput, { legend: 'Date', name: 'date', value: { day: '1', month: '2', year: '2000' } } as never))).toThrow('onValueChange');
    expect(() => renderToString(React.createElement(DateInput, { legend: 'Date', name: 'date', errorAssociation: 'children', error: { message: 'Error' }, invalidParts: [] } as never))).toThrow('at least one');
    expect(() => renderToString(<DateInput legend="Date" name="date" partNames={{ day: 'same', month: 'same', year: 'same' }} />)).toThrow('distinct');
  });
});

describe('error summary events and links', () => {
  const errors = [{ id: 'second', text: 'Enter the second answer', targetId: 'second' }, { id: 'first', text: 'Enter the first answer', targetId: 'first' }];
  const fields = <><TextInput id="first" label="First" name="first" error={{ message: 'Enter the first answer' }} /><TextInput id="second" label="Second" name="second" /></>;

  it('sorts document order, deduplicates issues and focuses once per failed-submit key in Strict Mode', async () => {
    document.title = 'Application';
    const focus = vi.spyOn(HTMLElement.prototype, 'focus');
    const ref = createRef<HTMLDivElement>();
    const app = (key: number) => <React.StrictMode><ErrorSummary ref={ref} errors={[...errors, errors[1]]} focusRequestKey={key} />{fields}</React.StrictMode>;
    const { rerender, unmount } = render(app(1));
    expect(screen.getAllByRole('link').map(link => link.textContent)).toEqual(['Enter the first answer', 'Enter the second answer']);
    expect(ref.current).toHaveFocus(); expect(ref.current).toHaveAttribute('tabindex', '-1'); expect(ref.current).not.toHaveAttribute('role');
    expect(focus.mock.contexts.filter(node => node === ref.current)).toHaveLength(1);
    expect(document.title).toBe('Error: Application');
    const input = screen.getByLabelText('First'); input.focus(); await userEvent.setup().type(input, 'A');
    rerender(app(1)); expect(input).toHaveFocus(); expect(focus.mock.contexts.filter(node => node === ref.current)).toHaveLength(1);
    rerender(app(2)); expect(ref.current).toHaveFocus(); expect(focus.mock.contexts.filter(node => node === ref.current)).toHaveLength(2);
    expect(document.title).toBe('Error: Application'); unmount(); expect(document.title).toBe('Application');
  });

  it('retains real fragments and scrolls the associated label before focusing a native control', async () => {
    render(<><ErrorSummary errors={[errors[1]]} />{fields}</>);
    const link = screen.getByRole('link'); expect(link).toHaveAttribute('href', '#first');
    expect(link).toHaveAccessibleName('Enter the first answer');
    await userEvent.setup().click(link);
    expect(screen.getByLabelText('First')).toHaveFocus();
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    expect(screen.getByLabelText('First')).toHaveAccessibleDescription('Enter the first answer');
  });

  it('routes group dates to Day and part errors to the affected part without focusing Fieldset', async () => {
    const ids = getDateInputIds('dob');
    const { rerender } = render(<><ErrorSummary errors={[{ id: 'dob', text: 'Enter your date', targetId: ids.day, contextId: ids.group }]} />
      <DateInput id="dob" name="dob" legend="Birth date" helperText="Example date" error={{ message: 'Enter your date' }} /></>);
    await userEvent.setup().click(screen.getByRole('link')); expect(screen.getByLabelText('Day')).toHaveFocus();
    expect(screen.getByRole('group')).toHaveAccessibleDescription('Example date Enter your date');
    rerender(<><ErrorSummary errors={[{ id: 'dob-year', text: 'Enter a year', targetId: ids.year }]} />
      <DateInput id="dob" name="dob" legend="Birth date" helperText="Example date" error={{ message: 'Enter a year' }} errorAssociation="children" invalidParts={['year']} /></>);
    await userEvent.setup().click(screen.getByRole('link')); expect(screen.getByLabelText('Year')).toHaveFocus();
    expect(screen.getByLabelText('Year')).toHaveAccessibleDescription('Enter a year'); expect(screen.getByRole('group')).not.toHaveFocus();
  });

  it('preserves a navigation-owned title and leaves passive summaries unfocused', () => {
    document.title = 'Application';
    const { unmount } = render(<><ErrorSummary errors={[errors[1]]} />{fields}</>);
    expect(screen.getByText('There is a problem').parentElement).not.toHaveFocus();
    document.title = 'Next page'; unmount(); expect(document.title).toBe('Next page');
  });

  it('keeps server markup and IDs stable through hydration before performing focus', async () => {
    const app = <><ErrorSummary errors={[{ id: 'date', text: 'Enter the date', targetId: 'date-day', contextId: 'date' }]} focusRequestKey="failed-1" />
      <DateInput id="date" name="date" legend="Date" error={{ message: 'Enter the date' }} /></>;
    const div = document.createElement('div'); div.innerHTML = renderToString(app); document.body.append(div);
    const ids = [...div.querySelectorAll('[id]')].map(node => node.id); const failures: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => { root = hydrateRoot(div, app, { onRecoverableError: error => failures.push(error) }); });
    expect(failures).toEqual([]); expect([...div.querySelectorAll('[id]')].map(node => node.id)).toEqual(ids);
    expect(div.querySelector('.owla11y-error-summary')).toHaveFocus();
    await act(async () => root.unmount()); div.remove();
  });

  it('rejects empty lists, conflicting duplicate IDs, bullet text and invalid DOM targets', () => {
    expect(() => renderToString(<ErrorSummary errors={[]} />)).toThrow('at least one');
    expect(() => renderToString(<ErrorSummary errors={[errors[0], { ...errors[0], text: 'Different issue' }]} />)).toThrow('stable issue');
    expect(() => renderToString(<ErrorSummary errors={[{ ...errors[0], text: '• Bad marker' }]} />)).toThrow('list marker');
    expect(() => render(<ErrorSummary errors={[{ id: 'missing', text: 'Missing target', targetId: 'missing' }]} />)).toThrow('exactly one');
    expect(() => render(<><ErrorSummary errors={[{ id: 'disabled', text: 'Disabled target', targetId: 'disabled' }]} /><input id="disabled" disabled /></>)).toThrow('visible enabled');
  });

  it('passes supplied form markup accessibility checks without duplicate live announcements', async () => {
    const { container } = render(<main><h1>Application</h1><ErrorSummary errors={[{ id: 'date', text: 'Enter the date', targetId: 'date-day' }]} />
      <DateInput id="date" name="date" legend="Date" error={{ message: 'Enter the date' }} /></main>);
    expect(container.querySelector('[role=alert], [aria-live]')).toBeNull();
    expect((await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })).violations).toEqual([]);
  });
});
