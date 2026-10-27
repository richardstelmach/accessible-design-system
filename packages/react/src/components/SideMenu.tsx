'use client';
import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import type { SideMenuLink, SideMenuProps } from '../types.js';
import { Accordion } from './Accordion.js';
import { Link } from './Link.js';
import { classes, text } from '../internal/validation.js';
import { metadataOnly, navigationAttributes, navigationHref } from '../internal/navigation.js';

export const SideMenu = forwardRef<HTMLElement, SideMenuProps>(function SideMenu({
  'aria-label': ariaLabel, items, currentId, headingLevel = 'none', expandedIds, defaultExpandedIds,
  onExpandedChange, id, className, ...props
}, ref) {
  metadataOnly(props, 'SideMenu');
  if (ariaLabel !== undefined) text(ariaLabel, 'SideMenu aria-label');
  if (headingLevel !== 'none' && ![2,3,4,5,6].includes(headingLevel)) throw new Error('OwlA11y: SideMenu headingLevel must be none or 2 through 6.');
  if (!Array.isArray(items) || !items.length) throw new Error('OwlA11y: SideMenu requires items.');
  const keys: string[] = [], links: string[] = [], groups: string[] = [];
  const validateLink = (item: SideMenuLink) => {
    text(item.id, 'SideMenu item id'); text(item.label, 'SideMenu item label');
    navigationHref(item.href); navigationAttributes(item.linkAttributes);
    if (item.items !== undefined || item.expandable !== undefined) throw new Error('OwlA11y: SideMenu supports one group level only.');
    keys.push(item.id); links.push(item.id);
  };
  for (const item of items) {
    if (item.items !== undefined) {
      text(item.id, 'SideMenu group id'); text(item.label, 'SideMenu group label');
      if (item.href !== undefined || item.linkAttributes !== undefined || !Array.isArray(item.items) || !item.items.length)
        throw new Error('OwlA11y: SideMenu groups require links and cannot also navigate; add an Overview link.');
      if (item.expandable !== undefined && typeof item.expandable !== 'boolean') throw new Error('OwlA11y: SideMenu expandable must be boolean.');
      keys.push(item.id); if (item.expandable) groups.push(item.id); item.items.forEach(validateLink);
    } else validateLink(item as SideMenuLink);
  }
  if (new Set(keys).size !== keys.length) throw new Error('OwlA11y: SideMenu item IDs must be globally unique.');
  if (currentId !== undefined && !links.includes(currentId)) throw new Error('OwlA11y: SideMenu currentId must identify a link.');
  const controlled = expandedIds !== undefined, ownership = useRef(controlled);
  if (ownership.current !== controlled) throw new Error('OwlA11y: SideMenu cannot switch expansion ownership.');
  if (controlled && (defaultExpandedIds !== undefined || !onExpandedChange)) throw new Error('OwlA11y: controlled SideMenu requires onExpandedChange and forbids defaultExpandedIds.');
  for (const ids of [expandedIds, defaultExpandedIds]) if (ids !== undefined && (!Array.isArray(ids) || new Set(ids).size !== ids.length || ids.some(key => !groups.includes(key))))
    throw new Error('OwlA11y: SideMenu expanded IDs must identify unique expandable groups.');
  if (groups.length && headingLevel === 'none') throw new Error('OwlA11y: expandable SideMenu groups require an explicit headingLevel for Accordion.');
  const generated = useId(), prefix = id ?? `owl-side-menu-${generated}`;
  text(prefix, 'SideMenu id'); if (/\s/.test(prefix)) throw new Error('OwlA11y: SideMenu id must not contain whitespace.');
  const currentGroup = items.find(item => item.expandable && item.items?.some((link: SideMenuLink) => link.id === currentId))?.id;
  const [own, setOwn] = useState<readonly string[]>(() => [...new Set([...(defaultExpandedIds ?? []), ...(currentGroup ? [currentGroup] : [])])]);
  useEffect(() => {
    if (!controlled && own.some(key => !groups.includes(key))) setOwn(ids => ids.filter(key => groups.includes(key)));
  });
  const desired = groups.filter(key => (expandedIds ?? own).includes(key));
  const previousCurrent = useRef(currentId);
  const request = (ids: string[]) => { if (!controlled) setOwn(ids); onExpandedChange?.(ids); };
  useEffect(() => {
    if (previousCurrent.current !== currentId) {
      previousCurrent.current = currentId;
      if (currentGroup && !desired.includes(currentGroup)) request([...desired, currentGroup]);
    }
  });
  const Caption = headingLevel === 'none' ? 'p' : `h${headingLevel}` as 'h2'|'h3'|'h4'|'h5'|'h6';
  const link = (item: SideMenuLink) => <li key={item.id}><Link {...item.linkAttributes} href={item.href} presentation="standalone"
    aria-current={item.id === currentId ? 'page' : undefined} className="owla11y-side-menu__link"><bdi>{item.label}</bdi></Link></li>;
  return <nav {...props} id={prefix} aria-label={ariaLabel} className={classes('owla11y-side-menu',className)}
    ref={ref}>
    <ul className="owla11y-side-menu__list">{items.map(item=>{
      if (item.items === undefined) return link(item as SideMenuLink);
      const key=encodeURIComponent(item.id), captionId=`${prefix}-label-${key}`;
      if (item.expandable) return <li key={item.id} className="owla11y-side-menu__group">
        <Accordion id={`${prefix}-accordion-${key}`} className="owla11y-side-menu__accordion"
          headingLevel={headingLevel as 2|3|4|5|6} titleStyle="h6"
          items={[{id:item.id,title:item.label,content:<ul className="owla11y-side-menu__list owla11y-side-menu__accordion-links">{item.items.map(link)}</ul>}]}
          expandedIds={desired.includes(item.id)?[item.id]:[]}
          onExpandedChange={ids=>request(ids.includes(item.id)?[...new Set([...desired,item.id])]:desired.filter(id=>id!==item.id))}/>
      </li>;
      return <li key={item.id} className="owla11y-side-menu__group">
        <Caption id={captionId} className="owla11y-side-menu__caption">{item.label}</Caption>
        <ul aria-labelledby={captionId} className="owla11y-side-menu__list">{item.items.map(link)}</ul>
      </li>;
    })}</ul>
  </nav>;
});
