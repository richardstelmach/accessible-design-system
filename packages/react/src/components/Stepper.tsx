'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { StepperProps } from '../types.js';
import { IconButton } from './Button.js';
import { FieldHeader, rejectProps, useField, useUnavailable } from '../internal/forms.js';
import { classes, text } from '../internal/validation.js';
import { initialQuantity, quantity } from '../internal/stepper.js';
const icon = (plus: boolean) => <svg viewBox="0 0 256 256" focusable="false"><path fill="currentColor" d={plus ? 'M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z' : 'M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z'}/></svg>;
export const Stepper = forwardRef<HTMLInputElement, StepperProps>(function Stepper({ label, name, id, helperText, error, errorDescribedBy, requirement = 'required', optionalLabel = '(optional)', value, defaultValue, onValueChange, min, max, step, incrementLabel, decrementLabel, formatValueAnnouncement, disabled, className, 'aria-describedby': externalDescription, 'aria-invalid': externalInvalid, ...props }, ref) {
    for (const [key, number] of [['min', min], ['max', max], ['step', step]] as const)
        if ((key === 'step' || number !== undefined) && (typeof number !== 'number' || !Number.isFinite(number)))
            throw new Error(`OwlA11y: Stepper ${key} must be finite.`);
    if (step <= 0 || (min !== undefined && max !== undefined && min > max))
        throw new Error('OwlA11y: Stepper requires positive step and min <= max.');
    text(incrementLabel, 'Stepper incrementLabel');
    text(decrementLabel, 'Stepper decrementLabel');
    rejectProps(props, ['children', 'type', 'readOnly', 'required', 'placeholder', 'role', 'aria-label', 'aria-labelledby', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-readonly', 'aria-disabled', 'onChange', 'onInput', 'onReset'], 'Stepper');
    const controlled = value !== undefined;
    const ownership = useRef(controlled);
    if (controlled !== ownership.current)
        throw new Error('OwlA11y: Stepper must not switch value ownership.');
    if (controlled && (defaultValue !== undefined || !onValueChange))
        throw new Error('OwlA11y: controlled Stepper requires onValueChange and forbids defaultValue.');
    const initial = useRef({ raw: value ?? defaultValue ?? '', min, max, step });
    initialQuantity(initial.current.raw, initial.current.min, initial.current.max, initial.current.step);
    if (value !== undefined && typeof value !== 'string')
        throw new Error('OwlA11y: Stepper values must be raw strings.');
    const [own, setOwn] = useState(initial.current.raw);
    const raw = value ?? own;
    const [speech, setSpeech] = useState('');
    const input = useRef<HTMLInputElement>(null);
    const pending = useRef<{
        next: string;
        button: HTMLButtonElement;
        focused: boolean;
    } | null>(null);
    const field = useField({ id, label, name, helperText, error, errorDescribedBy, requirement, optionalLabel, disabled, externalDescription, externalInvalid });
    const unavailable = useUnavailable(disabled);
    if (props.tabIndex !== undefined && props.tabIndex !== 0)
        throw new Error('OwlA11y: Stepper retains native tab order.');
    const boundary = quantity(raw, min, max, step, min ?? Number((controlled ? value : initial.current.raw) || 0));
    useImperativeHandle(ref, () => input.current!, []);
    // Apply focus/announcements only once the owner has committed the requested value.
    useEffect(() => {
        const node = input.current!;
        const request = pending.current;
        if (!request || node.value !== request.next) return;
        pending.current = null;
        if (node.matches(':disabled')) return;
        const document = node.ownerDocument;
        if (request.focused && request.button.disabled &&
            (document.activeElement === request.button || document.activeElement === document.body)) {
            node.focus({ preventScroll: true });
        }
        if (document.activeElement !== node) {
            const message = formatValueAnnouncement?.(node.value, label) ?? `${label}: ${node.value}`;
            text(message, 'Stepper formatValueAnnouncement result');
            setSpeech(message);
        }
    });
    useEffect(() => {
        const node = input.current!;
        const form = node.form;
        if (!form) return;
        const reset = (event: Event) => queueMicrotask(() => {
            if (event.defaultPrevented || !node.isConnected) return;
            pending.current = null;
            if (!controlled) {
                // Native reset also bypasses the value setter observed by React.
                node.value = node.value;
                setOwn(node.value);
            }
            setSpeech('');
        });
        form.addEventListener('reset', reset);
        return () => form.removeEventListener('reset', reset);
    }, [controlled, props.form]);
    const change = (button: HTMLButtonElement, source: 'increment' | 'decrement') => {
        const node = input.current!;
        if (button.disabled || node.matches(':disabled') || node.validity.badInput)
            return;
        const old = node.value;
        source === 'increment' ? node.stepUp() : node.stepDown();
        const next = node.value;
        // Native stepUp/stepDown bypass the value setter. Reapply through that setter
        // so React observes subsequent native Arrow/input changes, including a return to old.
        if (controlled)
            node.value = old;
        else
            node.value = next;
        if (next === old)
            return;
        pending.current = { next, button, focused: node.ownerDocument.activeElement === button };
        if (!controlled)
            setOwn(next);
        onValueChange?.(next, { source });
    };
    return <div className={classes('owla11y-field', 'owla11y-stepper', className)}>
        <FieldHeader field={field} label={label} helperText={helperText} error={error}
            optional={requirement === 'optional'} optionalLabel={optionalLabel}/>
        <div className="owla11y-stepper__row">
            <IconButton icon={icon(false)} size="default" aria-label={decrementLabel}
                disabled={unavailable || boundary.minimum}
                onClick={event => change(event.currentTarget, 'decrement')}/>
            <input {...props} ref={input} id={field.controlId} name={name} type="number"
                min={min} max={max} step={step} disabled={disabled} required={requirement === 'required'}
                value={controlled ? value : undefined} defaultValue={controlled ? undefined : initial.current.raw}
                aria-invalid={field.invalid} aria-describedby={field.description}
                className="owla11y-input owla11y-stepper__input"
                inputMode={props.inputMode ?? (Number.isInteger(step) ? 'numeric' : 'decimal')}
                onChange={event => {
                    pending.current = null;
                    setSpeech('');
                    if (!controlled) setOwn(event.currentTarget.value);
                    onValueChange?.(event.currentTarget.value, { source: 'input' });
                }}/>
            <IconButton icon={icon(true)} size="default" aria-label={incrementLabel}
                disabled={unavailable || boundary.maximum}
                onClick={event => change(event.currentTarget, 'increment')}/>
        </div>
        <span className="owla11y-feedback-sr" role="status">{speech}</span>
    </div>;
});
