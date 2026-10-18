import React, { act, createRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import axe from 'axe-core';
import { Textarea, Select, Fieldset, Checkbox, Radio, TextInput } from '../src/index.js';

const options = <><option value="">Select a country</option><optgroup label="Countries"><option value="gb">United Kingdom</option><option value="ie">Ireland</option></optgroup></>;

describe('native form components', () => {
  it('gives multiline answers stable labels, descriptions, optional wording and native refs', async () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} label="Explanation" name="explanation" id="explanation" requirement="optional"
      helperText="Include dates" error={{ message: 'Error: Give more detail', id: 'explanation-error' }} aria-describedby="explanation-helper explanation-error" />);
    const control = screen.getByRole('textbox', { name: 'Explanation (optional)' });
    expect(ref.current).toBe(control);
    expect(control).toHaveAttribute('rows', '5');
    expect(control).not.toBeRequired();
    expect(control).toHaveAttribute('aria-describedby', 'explanation-helper explanation-error');
    expect(control).toHaveAccessibleDescription('Include dates Error: Give more detail');
    await userEvent.setup().type(control, 'First line{Enter}Second line');
    expect(control).toHaveValue('First line\nSecond line');
  });

  it('keeps textarea and select controlled state owned by the consumer', async () => {
    function Form() {
      const [answer, setAnswer] = useState('');
      const [country, setCountry] = useState('');
      return <><Textarea label="Answer" name="answer" value={answer} onChange={e => setAnswer(e.target.value)} />
        <Select label="Country" name="country" value={country} onChange={e => setCountry(e.target.value)}>{options}</Select></>;
    }
    render(<Form />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Answer'), 'Saved');
    await user.selectOptions(screen.getByLabelText('Country'), 'ie');
    expect(screen.getByLabelText('Answer')).toHaveValue('Saved');
    expect(screen.getByLabelText('Country')).toHaveValue('ie');
    await user.selectOptions(screen.getByLabelText('Country'), '');
    expect(screen.getByLabelText('Country')).toBeInvalid();
  });

  it('submits and resets native uncontrolled controls, preserving disabled and readonly semantics', async () => {
    const ref = createRef<HTMLSelectElement>();
    render(<form data-testid="form"><Textarea label="Notes" name="notes" defaultValue="First\nSecond" />
      <Textarea label="Saved" name="saved" defaultValue="Fixed" readOnly error={{ message: 'Hidden' }} />
      <Select ref={ref} label="Country" name="country" defaultValue="gb">{options}</Select>
      <Select label="Unavailable" name="unavailable" disabled defaultValue="ie" error={{ message: 'Also hidden' }}>{options}</Select>
      <Checkbox label="Updates" name="updates" value="yes" defaultChecked />
      <Radio label="Email" name="contact" value="email" defaultChecked /><Radio label="Phone" name="contact" value="phone" />
      <button type="reset">Reset</button></form>);
    const user = userEvent.setup();
    expect(ref.current).toBe(screen.getByLabelText('Country'));
    await user.clear(screen.getByLabelText('Notes'));
    await user.type(screen.getByLabelText('Notes'), 'Changed');
    await user.selectOptions(screen.getByLabelText('Country'), 'ie');
    await user.click(screen.getByLabelText('Updates'));
    await user.click(screen.getByLabelText('Phone'));
    const form = screen.getByTestId('form') as HTMLFormElement;
    const data = new FormData(form);
    expect(data.get('notes')).toBe('Changed'); expect(data.get('country')).toBe('ie');
    expect(data.get('saved')).toBe('Fixed'); expect(data.has('unavailable')).toBe(false);
    expect(data.has('updates')).toBe(false); expect(data.get('contact')).toBe('phone');
    await user.click(screen.getByText('Reset'));
    expect(screen.getByLabelText('Notes')).toHaveValue('First\\nSecond');
    expect(screen.getByLabelText('Country')).toHaveValue('gb');
    expect(screen.getByLabelText('Updates')).toBeChecked(); expect(screen.getByLabelText('Email')).toBeChecked();
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    expect(screen.queryByText('Also hidden')).not.toBeInTheDocument();
  });

  it('renders a native first-child legend with separate visual style and heading semantics', () => {
    const ref = createRef<HTMLFieldSetElement>();
    render(<Fieldset ref={ref} legend="Delivery" legendStyle="compact" headingLevel="h3" helperText="Choose one" error={{ message: 'Error: Choose a method' }}>
      <Radio label="Post" name="delivery" value="post" description="Arrives tomorrow" />
    </Fieldset>);
    const group = screen.getByRole('group', { name: 'Delivery' });
    expect(ref.current).toBe(group);
    expect(group.firstElementChild?.tagName).toBe('LEGEND');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Delivery');
    expect(group).toHaveAccessibleDescription('Choose one Error: Choose a method');
    expect(group).not.toHaveAttribute('aria-invalid');
    expect(group).not.toHaveAttribute('errorAssociation');
    const radio = screen.getByRole('radio', { name: 'Post' });
    expect(radio).toHaveAccessibleDescription('Arrives tomorrow');
    expect(radio).not.toHaveAttribute('aria-invalid');
    expect(radio).not.toBeChecked();
  });

  it('associates one child-specific error only with the explicitly affected field', () => {
    render(<Fieldset legend="Address" helperText="Your current address" errorAssociation="children" error={{ id: 'address-error', message: 'Error: Explain the location' }}>
      <Textarea label="Location" name="location" helperText="Landmarks help" errorDescribedBy="address-error" />
      <Select label="Country" name="country">{options}</Select>
    </Fieldset>);
    const group = screen.getByRole('group', { name: 'Address' });
    expect(group).toHaveAccessibleDescription('Your current address');
    expect(screen.getAllByText('Error: Explain the location')).toHaveLength(1);
    expect(screen.getByLabelText('Location')).toHaveAccessibleDescription('Landmarks help Error: Explain the location');
    expect(screen.getByLabelText('Location')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Country')).not.toHaveAttribute('aria-invalid');
  });

  it('honours disabled Fieldsets for native submission and descendant error presentation', () => {
    render(<form data-testid="disabled-form"><Fieldset legend="Unavailable group" disabled error={{ message: 'Hidden group error' }}>
      <Textarea label="Details" name="details" defaultValue="Saved" error={{ message: 'Hidden textarea error' }} />
      <Select label="Country" name="country">{options}</Select>
      <Checkbox label="Choice" name="choice" value="yes" defaultChecked error={{ message: 'Hidden checkbox error' }} />
      <Radio label="Answer" name="answer" value="a" />
      <TextInput label="Reference" name="reference" error={{ message: 'Hidden input error' }} />
    </Fieldset></form>);
    for (const label of ['Details', 'Country', 'Choice', 'Answer', 'Reference']) expect(screen.getByLabelText(label)).toBeDisabled();
    expect([...new FormData(screen.getByTestId('disabled-form') as HTMLFormElement)]).toEqual([]);
    expect(screen.queryByText(/Hidden/)).not.toBeInTheDocument();
  });

  it('keeps indeterminate independent of checkedness and forwards the native input ref', async () => {
    const ref = createRef<HTMLInputElement>();
    const { rerender } = render(<form data-testid="mixed"><Checkbox ref={ref} label="All" name="all" value="yes" indeterminate /></form>);
    expect(ref.current).toBe(screen.getByRole('checkbox', { name: 'All' }));
    expect(ref.current?.indeterminate).toBe(true); expect(ref.current).not.toBeChecked();
    expect(ref.current).not.toHaveAttribute('indeterminate'); expect(ref.current).not.toHaveAttribute('aria-checked');
    expect(new FormData(screen.getByTestId('mixed') as HTMLFormElement).has('all')).toBe(false);
    await userEvent.setup().click(ref.current!);
    expect(ref.current?.indeterminate).toBe(false); expect(ref.current).toBeChecked();
    // Remount a controlled aggregate: checkedness still owns submission.
    rerender(<form data-testid="mixed"><Checkbox key="new" ref={ref} label="All" name="all" value="yes" checked indeterminate onChange={() => {}} /></form>);
    expect(ref.current?.indeterminate).toBe(true);
    expect(new FormData(screen.getByTestId('mixed') as HTMLFormElement).get('all')).toBe('yes');
  });

  it('keeps option descriptions and individual checkbox errors out of the accessible name', async () => {
    render(<Checkbox label="Accept terms" name="terms" value="accepted" required description="Read the agreement first" error={{ message: 'Error: Accept to continue' }} />);
    const control = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(control).toHaveAccessibleDescription('Read the agreement first Error: Accept to continue');
    expect(control).toHaveAttribute('aria-invalid', 'true'); expect(control).toBeRequired();
    await userEvent.setup().click(screen.getByText('Read the agreement first'));
    expect(control).not.toBeChecked();
    await userEvent.setup().click(screen.getByText('Accept terms'));
    expect(control).toBeChecked();
  });

  it('keeps native refs and programmatic indeterminate updates safe through Strict Mode lifecycle', () => {
    const ref = createRef<HTMLInputElement>();
    const view = (indeterminate: boolean) => <React.StrictMode><Fieldset legend="Topics">
      <Checkbox ref={ref} label="All topics" name="topics" value="all" defaultChecked indeterminate={indeterminate} />
    </Fieldset></React.StrictMode>;
    const { rerender, unmount } = render(view(true));
    const input = ref.current;
    expect(input?.indeterminate).toBe(true); expect(input).toBeChecked();
    rerender(view(false)); expect(ref.current).toBe(input); expect(input?.indeterminate).toBe(false);
    rerender(view(true)); expect(input?.indeterminate).toBe(true); expect(input).toBeChecked();
    unmount(); expect(ref.current).toBeNull();
  });

  it('omits empty descriptions and never preselects new answers', () => {
    render(<><Radio label="One" name="one" value="a" description="  " />
      <Checkbox label="Two" name="two" value="b" description="" />
      <Select label="Country" name="country">{options}</Select></>);
    expect(screen.getByLabelText('One')).not.toHaveAttribute('aria-describedby');
    expect(screen.getByLabelText('Two')).not.toHaveAttribute('aria-describedby');
    expect(screen.getByLabelText('Two')).not.toBeRequired();
    expect(screen.getByLabelText('Country')).toHaveValue('');
  });

  it('updates controlled choices through native change events without duplicate state owners', async () => {
    function Choices() {
      const [checked, setChecked] = useState(false);
      const [answer, setAnswer] = useState('email');
      return <><Checkbox label="Updates" name="updates" value="yes" checked={checked} onChange={e => setChecked(e.target.checked)} />
        <Fieldset legend="Contact"><Radio label="Email" name="contact" value="email" checked={answer === 'email'} onChange={e => setAnswer(e.target.value)} />
          <Radio label="Phone" name="contact" value="phone" checked={answer === 'phone'} onChange={e => setAnswer(e.target.value)} /></Fieldset></>;
    }
    render(<Choices />);
    const user = userEvent.setup();
    await user.click(screen.getByLabelText('Updates')); expect(screen.getByLabelText('Updates')).toBeChecked();
    await user.click(screen.getByLabelText('Phone')); expect(screen.getByLabelText('Phone')).toBeChecked();
    expect(screen.getByLabelText('Email')).not.toBeChecked();
  });

  it('rejects prohibited props, ambiguous ownership and invalid semantic configurations', () => {
    expect(() => renderToString(<Select label="Country" name="country"><option value="gb">UK</option></Select>)).toThrow('first, enabled');
    expect(() => renderToString(<Select label="Country" name="country"><option value="" disabled>Choose</option></Select>)).toThrow('first, enabled');
    expect(() => renderToString(<Select label="Country" name="country"><option value="" selected>Choose</option></Select>)).toThrow('instead of option selected');
    expect(() => renderToString(<Textarea label="Details" name="details" rows={0} />)).toThrow('positive integer');
    expect(() => renderToString(React.createElement(Textarea, { label: 'Details', name: 'details', placeholder: 'Forbidden' } as never))).toThrow('does not support');
    expect(() => renderToString(React.createElement(Radio, { label: 'One', name: 'one', value: 'a', 'aria-invalid': true } as never))).toThrow('does not support');
    expect(() => renderToString(React.createElement(Fieldset, { legend: 'Question', errorAssociation: 'children', error: { message: 'Missing id' }, children: <div /> } as never))).toThrow('error id');
    expect(() => renderToString(<Fieldset legend="Question" errorAssociation="children" error={{ id: 'shared', message: 'Error' }} aria-describedby="shared"><div /></Fieldset>)).toThrow('must not also describe');
  });

  it('preserves unique IDs and relationships through SSR and hydration', async () => {
    const app = <Fieldset legend="Question" helperText="Help"><Textarea label="Notes" name="notes" />
      <Select label="Country" name="country">{options}</Select><Checkbox label="Updates" name="updates" value="yes" indeterminate />
      <Radio label="Email" name="contact" value="email" /></Fieldset>;
    const div = document.createElement('div'); div.innerHTML = renderToString(app); document.body.append(div);
    const ids = [...div.querySelectorAll('[id]')].map(node => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    const errors: unknown[] = []; let root: ReturnType<typeof hydrateRoot>;
    await act(async () => { root = hydrateRoot(div, app, { onRecoverableError: e => errors.push(e) }); });
    expect([...div.querySelectorAll('[id]')].map(node => node.id)).toEqual(ids);
    expect(errors).toEqual([]); expect(div.querySelector<HTMLInputElement>('[type=checkbox]')?.indeterminate).toBe(true);
    await act(async () => root.unmount()); div.remove();
  });

  it('passes automated markup accessibility checks for an integrated form', async () => {
    const { container } = render(<main><h1>Application</h1><form><Textarea label="Notes" name="notes" />
      <Select label="Country" name="country">{options}</Select><Fieldset legend="Contact" helperText="Choose one" error={{ message: 'Error: Choose a method' }}>
        <Radio label="Email" name="contact" value="email" description="Sent to your inbox" /><Radio label="Phone" name="contact" value="phone" />
      </Fieldset><Checkbox label="Accept terms" name="terms" value="yes" /></form></main>);
    expect((await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })).violations).toEqual([]);
  });
});
