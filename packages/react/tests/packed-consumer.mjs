import React from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import { Button, IconButton, Link, TextInput, Textarea, Select, Fieldset, Checkbox, Radio } from '@owla11y/react';

const h = React.createElement;
const app = h('form', null,
  h(TextInput, { label: 'Name', name: 'name', defaultValue: 'Ada' }),
  h(Textarea, { label: 'Notes', name: 'notes', defaultValue: 'Saved notes' }),
  h(Select, { label: 'Country', name: 'country', defaultValue: 'gb' },
    h('option', { value: '' }, 'Select a country'), h('option', { value: 'gb' }, 'United Kingdom')),
  h(Fieldset, { legend: 'Contact', helperText: 'Choose one', error: { id: 'contact-error', message: 'Error: Choose a method' } },
    h(Radio, { label: 'Email', name: 'contact', value: 'email', defaultChecked: true }),
    h(Radio, { label: 'Phone', name: 'contact', value: 'phone' })),
  h(Checkbox, { label: 'Updates', name: 'updates', value: 'yes', defaultChecked: true, indeterminate: true }),
  h(Button, null, 'Save'), h(IconButton, { 'aria-label': 'Add', icon: h('svg') }), h(Link, { href: '/help' }, 'Help'));

const html = renderToString(app);
const dom = new JSDOM('<div id="root">' + html + '</div>', { url: 'https://example.test/' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
const root = document.getElementById('root');
const ids = [...root.querySelectorAll('[id]')].map(node => node.id);
assert.equal(new Set(ids).size, ids.length);
const errors = [];
const hydrated = hydrateRoot(root, app, { onRecoverableError: error => errors.push(error) });
await new Promise(resolve => setTimeout(resolve, 60));
assert.deepEqual([...root.querySelectorAll('[id]')].map(node => node.id), ids);
assert.deepEqual(errors, []);
for (const label of root.querySelectorAll('label')) assert.ok(document.getElementById(label.htmlFor));
assert.equal(root.querySelector('button').type, 'button');
assert.equal(root.querySelector('a').getAttribute('href'), '/help');
const fieldset = root.querySelector('fieldset');
assert.equal(fieldset.firstElementChild.tagName, 'LEGEND');
assert.ok(fieldset.getAttribute('aria-describedby').includes('contact-error'));
assert.equal(fieldset.querySelector('input').hasAttribute('aria-invalid'), false);
const checkbox = root.querySelector('[type=checkbox]');
assert.equal(checkbox.indeterminate, true);
const form = root.querySelector('form');
assert.equal(new dom.window.FormData(form).get('updates'), 'yes');
root.querySelector('[name=name]').value = 'Changed';
root.querySelector('textarea').value = 'Changed notes';
root.querySelector('select').value = '';
checkbox.checked = false;
root.querySelector('[value=phone]').checked = true;
form.reset();
assert.equal(root.querySelector('[name=name]').value, 'Ada');
assert.equal(root.querySelector('textarea').value, 'Saved notes');
assert.equal(root.querySelector('select').value, 'gb');
assert.equal(checkbox.checked, true);
assert.equal(root.querySelector('[value=email]').checked, true);
hydrated.unmount();
console.log('Packed package: React ' + React.version + ' all nine exports, types, SSR, hydration, IDs and native reset passed');
