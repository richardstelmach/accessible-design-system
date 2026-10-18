# Toast accessibility decisions

Reviewed 18 October 2026 against primary W3C sources and the existing Alert, Button and focus contracts.

## Timing

WCAG does not prohibit all timed toasts. The [2.2.1 Timing Adjustable explanation](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable/#intent) gives an email toast as an example: disappearance need not impose a time limit when the same information or function remains available without that timer. Otherwise the time limit needs the applicable off, adjust or extend mechanism or an applicable exception. Pausing only while hovered does not provide that complete guarantee.

**System decision:** Toast has no timer option. It remains until explicit dismissal. This is a usability and accessibility policy stronger than the minimum, consistent with Richard's preference. It avoids requiring every consumer to establish a durable equivalent or manage reading time. A future timed capability would need a separate reviewed use case and contract change; it is not a hidden duration setting.

Persistence has its own costs: accumulating messages can obscure content and create excessive tab stops. The contract therefore requires a reachable region, chronological ordering, no silent eviction, and an in-flow fallback. High-volume activity belongs in a notification centre. Important outcomes remain in task context too.

## Announcement urgency

[WAI-ARIA 1.2 status](https://www.w3.org/TR/wai-aria-1.2/#status) supplies implicit polite and atomic live-region semantics. [Alert](https://www.w3.org/TR/wai-aria-1.2/#alert) supplies assertive and atomic semantics. The [APG Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) advises against automatically disappearing alerts, frequent interruptions and moving keyboard focus to an alert.

**System decision:** default to polite. Assertive is an explicit exception for important time-sensitive changes, independent of success/info/warning/error appearance. An ordinary failed upload can be polite; loss of connectivity threatening unsaved work may justify assertive. Required acknowledgement uses an appropriate task flow or dialog, not a louder Toast.

The [4.1.3 Status Messages explanation](https://www.w3.org/WAI/WCAG22/Understanding/status-messages/) warns against overusing assertive announcements and overly chatty interfaces. Put controls outside the live text. Use one announcement owner with pre-existing empty channels; keep the visible notification list available for review without making it another live region. Batch bursts meaningfully rather than relying on rapid text replacement. Screen-reader delivery remains a runtime test, not something Figma can verify.

## Focus and dismissal

Arrival leaves focus untouched. The close icon is a native named button with the existing comfortable target. Scoped Escape is an additional convenience only while focus is inside that Toast. On removal, recover focus only when it was inside the removed notification, following list order and then a stable host fallback. This is a system-specific interaction contract informed by [2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order/) and [2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum/).
