'use client';
import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import type { AccordionProps } from '../types.js';
import { classes, oneOf, text } from '../internal/validation.js';
import { rejectProps } from '../internal/forms.js';
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion({ items, headingLevel, titleStyle = `h${headingLevel}`, expandedIds, defaultExpandedIds, onExpandedChange, panelLandmark = false, className, id, ...props }, ref) {
    if (!Array.isArray(items) || !items.length)
        throw new Error('OwlA11y: Accordion requires at least one item.');
    const keys = items.map(item => {
        text(item.id, 'Accordion item id');
        text(item.title, 'Accordion title');
        if (item.content == null || typeof item.content === 'boolean') {
            throw new Error('OwlA11y: Accordion items require content.');
        }
        return item.id;
    });
    if (new Set(keys).size !== keys.length)
        throw new Error('OwlA11y: Accordion item IDs must be unique.');
    if (![2, 3, 4, 5, 6].includes(headingLevel))
        throw new Error('OwlA11y: Accordion requires headingLevel 2 through 6.');
    oneOf(titleStyle, ['h2', 'h3', 'h4', 'h5', 'h6'], 'Accordion titleStyle');
    rejectProps(props, ['children', 'role', 'tabIndex', 'aria-live', 'onChange', 'dangerouslySetInnerHTML', 'disabled', 'singleOpen', 'exclusive', 'requireOneOpen', 'initialExpandedIds'], 'Accordion');
    const controlled = expandedIds !== undefined;
    const ownership = useRef(controlled);
    if (controlled !== ownership.current)
        throw new Error('OwlA11y: Accordion must not switch expansion ownership.');
    if (controlled && (defaultExpandedIds !== undefined || !onExpandedChange))
        throw new Error('OwlA11y: controlled Accordion requires onExpandedChange and forbids defaultExpandedIds.');
    for (const ids of [expandedIds, defaultExpandedIds])
        if (ids !== undefined && (!Array.isArray(ids) || new Set(ids).size !== ids.length || ids.some(key => !keys.includes(key))))
            throw new Error('OwlA11y: Accordion expanded IDs must be unique existing keys.');
    const generated = useId();
    const prefix = id ?? `owl-accordion-${generated}`;
    text(prefix, 'Accordion id');
    if (/\s/.test(prefix))
        throw new Error('OwlA11y: Accordion id must not contain whitespace.');
    const [own, setOwn] = useState<readonly string[]>(defaultExpandedIds ?? []);
    const desired = keys.filter(key => (expandedIds ?? own).includes(key));
    const [view, setView] = useState<{
        enhanced: boolean;
        ids: string[];
    }>({ enhanced: false, ids: [] });
    const [, revise] = useState(0);
    const root = useRef<HTMLDivElement | null>(null);
    const protection = useRef<string | null>(null);
    const requested = useRef<string | null>(null);
    const panels = useRef(new Map<string, HTMLDivElement>());
    const triggers = useRef(new Map<string, HTMLButtonElement>());
    useEffect(() => {
        const document = root.current!.ownerDocument;
        const changed = () => revise(n => n + 1);
        document.addEventListener('focusin', changed);
        return () => document.removeEventListener('focusin', changed);
    }, []);
    useEffect(() => {
        const active = root.current!.ownerDocument.activeElement;
        const focused = keys.find(key => panels.current.get(key)?.contains(active));
        let next = desired;
        if (!view.enhanced && focused && !desired.includes(focused))
            protection.current = focused;
        if (protection.current && focused === protection.current && !desired.includes(protection.current)) {
            next = keys.filter(key => desired.includes(key) || key === protection.current);
            if (controlled && requested.current !== protection.current) {
                requested.current = protection.current;
                onExpandedChange!(next);
            }
            if (!controlled && (next.length !== own.length || next.some((key, index) => key !== own[index])))
                setOwn(next);
        }
        else {
            protection.current = null;
            requested.current = null;
        }
        // Keep old visibility through commit, recover focus, then apply external collapse.
        if (view.enhanced && focused && !next.includes(focused))
            triggers.current.get(focused)?.focus({ preventScroll: true });
        if (!view.enhanced || next.length !== view.ids.length || next.some((key, index) => key !== view.ids[index]))
            setView({ enhanced: true, ids: next });
    });
    const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    return <div {...props} id={prefix} className={classes('owla11y-accordion', className)} ref={node => {
        root.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
    }}>
        {items.map(item => {
            const key = encodeURIComponent(item.id);
            const triggerId = `${prefix}-trigger-${key}`;
            const panelId = `${prefix}-panel-${key}`;
            const open = !view.enhanced || view.ids.includes(item.id);
            return <div key={item.id} className="owla11y-accordion__item">
                <Heading className="owla11y-accordion__heading" data-title-style={titleStyle}>
                    {view.enhanced ? <button type="button" id={triggerId}
                        aria-expanded={open} aria-controls={panelId} className="owla11y-accordion__trigger"
                        ref={node => {
                            if (node) triggers.current.set(item.id, node);
                            else triggers.current.delete(item.id);
                        }}
                        onClick={() => {
                            const next = keys.filter(key => key === item.id ? !view.ids.includes(key) : view.ids.includes(key));
                            if (!controlled) setOwn(next);
                            onExpandedChange?.(next);
                        }}>
                        <span>{item.title}</span>
                        <svg className="owla11y-accordion__caret" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
                            <path fill="currentColor" d={open ? 'M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z' : 'M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z'}/>
                        </svg>
                    </button> : <span id={triggerId} className="owla11y-accordion__baseline">{item.title}</span>}
                </Heading>
                <div id={panelId} className="owla11y-accordion__panel" hidden={!open}
                    role={panelLandmark ? 'region' : undefined} aria-labelledby={panelLandmark ? triggerId : undefined}
                    ref={node => {
                        if (node) panels.current.set(item.id, node);
                        else panels.current.delete(item.id);
                    }}>{item.content}</div>
            </div>;
        })}
    </div>;
});
