import React from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import { Button, IconButton, Link, TextInput, Textarea, Select, Fieldset, Checkbox, Radio, DateInput, ErrorSummary, getDateInputIds } from '@owla11y/react';

const h = React.createElement;
const dateIds = getDateInputIds('packed-date');
const app = h('form', null,
  h(ErrorSummary, { errors: [{ id: 'date', text: 'Enter a year', targetId: dateIds.year }, { id: 'name', text: 'Check the name', targetId: 'packed-name' }], focusRequestKey: 1 }),
  h(TextInput, { id: 'packed-name', label: 'Name', name: 'name', defaultValue: 'Ada' }),
  h(DateInput, { id: dateIds.group, legend: 'Birth date', name: 'date', purpose: 'date-of-birth', defaultValue: { day: '01', month: '02', year: '2000' }, error: { message: 'Enter a year' }, errorAssociation: 'children', invalidParts: ['year'] }),
  h(Textarea, { label: 'Notes', name: 'notes', defaultValue: 'Saved notes' }),
  h(Select, { label: 'Country', name: 'country', defaultValue: 'gb' },
    h('option', { value: '' }, 'Select a country'), h('option', { value: 'gb' }, 'United Kingdom')),
  h(Fieldset, { id: 'packed-contact', legend: 'Contact', helperText: 'Choose one', error: { id: 'contact-error', message: 'Error: Choose a method' } },
    h(Radio, { label: 'Email', name: 'contact', value: 'email', defaultChecked: true }),
    h(Radio, { label: 'Phone', name: 'contact', value: 'phone' })),
  h(Checkbox, { label: 'Updates', name: 'updates', value: 'yes', defaultChecked: true, indeterminate: true }),
  h(Button, null, 'Save'), h(IconButton, { 'aria-label': 'Add', icon: h('svg') }), h(Link, { href: '/help' }, 'Help'));

const html = renderToString(app);
const dom = new JSDOM('<div id="root">' + html + '</div>', { url: 'https://example.test/' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
// Layout/scroll are supplied by the real-browser suite; jsdom verifies relationships/lifecycle.
dom.window.HTMLElement.prototype.getClientRects = function () { return [new dom.window.DOMRect(0, 0, 100, 40)]; };
dom.window.HTMLElement.prototype.scrollIntoView = function () {};
document.title = 'Packed example';
const root = document.getElementById('root');
const ids = [...root.querySelectorAll('[id]')].map(node => node.id);
assert.equal(new Set(ids).size, ids.length);
const errors = [];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let hydrated;
await React.act(async () => {
  hydrated = hydrateRoot(root, app, { onRecoverableError: error => errors.push(error) });
});
assert.deepEqual([...root.querySelectorAll('[id]')].map(node => node.id), ids);
assert.deepEqual(errors, []);
for (const label of root.querySelectorAll('label')) assert.ok(document.getElementById(label.htmlFor));
assert.equal(root.querySelector('button').type, 'button');
assert.equal(root.querySelector('.owla11y-link').getAttribute('href'), '/help');
const fieldset = root.querySelector('#packed-contact');
assert.equal(fieldset.firstElementChild.tagName, 'LEGEND');
assert.ok(fieldset.getAttribute('aria-describedby').includes('contact-error'));
assert.equal(fieldset.querySelector('input').hasAttribute('aria-invalid'), false);
assert.equal(root.querySelector('#packed-date').firstElementChild.tagName, 'LEGEND');
assert.equal(root.querySelector('#packed-date-year').getAttribute('aria-describedby'), 'packed-date-error');
assert.equal(root.querySelector('#packed-date-day').hasAttribute('aria-invalid'), false);
assert.ok(document.activeElement === root.querySelector('.owla11y-error-summary'), 'Committed summary must own focus');
assert.deepEqual([...root.querySelectorAll('.owla11y-error-summary a')].map(a => a.textContent), ['Check the name', 'Enter a year']);
assert.equal(document.title, 'Error: Packed example');
root.querySelector('.owla11y-error-summary a[href="#packed-date-year"]').click();
assert.ok(document.activeElement === root.querySelector('#packed-date-year'), 'Date summary link must focus Year');
const checkbox = root.querySelector('[type=checkbox]');
assert.equal(checkbox.indeterminate, true);
const form = root.querySelector('form');
assert.equal(new dom.window.FormData(form).get('updates'), 'yes');
root.querySelector('[name=name]').value = 'Changed';
root.querySelector('textarea').value = 'Changed notes';
root.querySelector('select').value = '';
checkbox.checked = false;
root.querySelector('[value=phone]').checked = true;
root.querySelector('#packed-date-year').value = 'Changed year';
form.reset();
assert.equal(root.querySelector('[name=name]').value, 'Ada');
assert.equal(root.querySelector('textarea').value, 'Saved notes');
assert.equal(root.querySelector('select').value, 'gb');
assert.equal(checkbox.checked, true);
assert.equal(root.querySelector('[value=email]').checked, true);
assert.equal(root.querySelector('#packed-date-year').value, '2000');
await React.act(async () => hydrated.unmount());
assert.equal(document.title, 'Packed example');
console.log('Packed package: React ' + React.version + ' eleven components, date IDs, types, SSR, hydration, error routing, title and native reset passed');
