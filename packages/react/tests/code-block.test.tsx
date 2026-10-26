import React, { createRef } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { CodeBlock } from '../src/index.js';

const code = '\n  <Button>Save</Button>\n\tend\n';
afterEach(() => vi.restoreAllMocks());
function clipboard(writeText: ReturnType<typeof vi.fn> | undefined) {
  Object.defineProperty(navigator, 'clipboard', { configurable:true, value: writeText ? { writeText } : undefined });
}
describe('CodeBlock', () => {
  it('preserves exact text, forwards the wrapper ref, and labels native code', () => {
    const ref = createRef<HTMLDivElement>();
    render(<CodeBlock ref={ref} label="React" code={code} />);
    expect(ref.current?.querySelector('pre > code')?.textContent).toBe(code);
    expect(ref.current?.querySelector('pre')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByText('Ready to copy.')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('button', {name:'Copy React code'})).toHaveAccessibleDescription('Ready to copy.');
  });
  it('copies only plain code and distinguishes repeated success without moving focus', async () => {
    const write = vi.fn().mockResolvedValue(undefined), onCopy = vi.fn(); clipboard(write);
    render(<CodeBlock label="React" code={code} onCopy={onCopy} />);
    const button = screen.getByRole('button'); button.focus(); fireEvent.click(button);
    await screen.findByText('Copied.');
    expect(write).toHaveBeenCalledWith(code); expect(onCopy).toHaveBeenCalledWith(code);
    fireEvent.click(button); await screen.findByText('Copied. Copy 2 complete.');
    expect(button).toHaveFocus();
  });
  it.each(['denied','unavailable'])('keeps selectable content and visible manual guidance when clipboard is %s', async mode => {
    clipboard(mode === 'denied' ? vi.fn().mockRejectedValue(new Error('Denied')) : undefined);
    render(<CodeBlock label="Shell" code={code} />);
    fireEvent.click(screen.getByRole('button')); await screen.findByText('Copy unavailable. Select and copy the code below.');
    expect(document.querySelector('code')?.textContent).toBe(code);
    fireEvent.click(screen.getByRole('button')); await screen.findByText('Copy unavailable. Select and copy the code below. Attempt 2.');
  });
  it('ignores reentrant activation, then discards stale completion after code changes', async () => {
    let complete!: () => void;
    const write = vi.fn().mockImplementation(() => new Promise<void>(resolve => { complete = resolve; })); clipboard(write);
    const onCopy = vi.fn();
    const {rerender} = render(<CodeBlock label="Shell" code="old" onCopy={onCopy} />);
    fireEvent.click(screen.getByRole('button')); fireEvent.click(screen.getByRole('button'));
    expect(write).toHaveBeenCalledTimes(1); expect(screen.getByText('Copying…')).toBeVisible();
    rerender(<CodeBlock label="Shell" code="new" onCopy={onCopy} />);
    await act(async () => complete());
    expect(screen.getByText('Ready to copy.')).toBeVisible(); expect(onCopy).not.toHaveBeenCalled();
  });
  it('measures actual overflow and retains a focused region until blur when it stops scrolling', async () => {
    let width = 50;
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(() => width);
    render(<CodeBlock label="CSS" code="long content" copyable={false} />);
    const pre = document.querySelector('pre')!;
    expect(pre.tabIndex).toBe(-1); expect(screen.queryByRole('button')).toBeNull();
    width = 200; fireEvent(window, new Event('resize'));
    await waitFor(() => expect(pre.tabIndex).toBe(0));
    expect(pre).toHaveAccessibleName('CSS code, horizontally scrollable');
    act(() => pre.focus()); width = 50; fireEvent(window, new Event('resize'));
    expect(pre.tabIndex).toBe(0);
    fireEvent.blur(pre); await waitFor(() => expect(pre.tabIndex).toBe(-1));
  });
  it('SSR keeps exact text with no inactive copy control or empty announcer', () => {
    const html = renderToString(<CodeBlock label="React" code={code}/>);
    expect(html).toContain('<pre'); expect(html).toContain('&lt;Button&gt;');
    expect(html).not.toContain('<button'); expect(html).not.toContain('aria-live'); expect(html).not.toContain('data-enhanced');
  });
  it('localises names and announcements without supplying HTML content', async () => {
    clipboard(vi.fn().mockResolvedValue(undefined));
    render(<CodeBlock label="CSS" code="a {}" labels={{copy:l=>`Copier ${l}`,success:n=>`Copié ${n}`}}/>);
    fireEvent.click(screen.getByRole('button',{name:'Copier CSS'})); await screen.findByText('Copié 1');
  });
  it('rejects invalid content and semantic overrides', () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(()=>{});
    expect(() => render(<CodeBlock label="" code=""/>)).toThrow();
    expect(() => render(React.createElement(CodeBlock, {label:'CSS',code:'',role:'button'} as any))).toThrow(/role/);
    quiet.mockRestore();
  });
});
