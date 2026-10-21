/** Public props for the implemented core components. */
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
type NativeButton = Omit<ComponentPropsWithoutRef<'button'>, 'children'>;
export type ButtonVariant = 'primary' | 'default' | 'destructive' | 'text';
export type ControlSize = 'compact' | 'default' | 'comfortable';
type OneIcon = { leadingIcon?: ReactNode; trailingIcon?: never } | { leadingIcon?: never; trailingIcon?: ReactNode };
export type ButtonProps = NativeButton & OneIcon & {
  children: string;
  variant?: ButtonVariant;
  size?: ControlSize;
};
type AccessibleName = { 'aria-label': string; 'aria-labelledby'?: never } | { 'aria-label'?: never; 'aria-labelledby': string };
export type IconButtonProps = Omit<NativeButton, 'aria-label' | 'aria-labelledby'> & AccessibleName & {
  icon: ReactNode;
  variant?: Exclude<ButtonVariant, 'text'>;
  size?: ControlSize;
};
export type LinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children'> & {
  href: string;
  children: ReactNode;
  presentation?: 'inline' | 'standalone';
  trailingIcon?: ReactNode;
};
export type FieldError = { message: string; id?: string };
type InputNative = Omit<ComponentPropsWithoutRef<'input'>, 'children' | 'size' | 'required' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'placeholder' | 'aria-label' | 'aria-labelledby'>;
type InputChange = NonNullable<ComponentPropsWithoutRef<'input'>['onChange']>;
type InputValue = { value: string; defaultValue?: never; onChange: InputChange } | { value: string; defaultValue?: never; readOnly: true; onChange?: InputChange } | {
  value?: never; defaultValue?: string; onChange?: InputChange;
};
/** Ref targets the native input, not the field wrapper. */
export type TextInputProps = InputNative & InputValue & {
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'search';
  'aria-label'?: never;
  'aria-labelledby'?: never;
  placeholder?: never;
  label: string;
  name: string;
  helperText?: string;
  error?: FieldError;
  errorDescribedBy?: string;
  requirement?: 'required' | 'optional';
  optionalLabel?: string;
  width?: 'full' | '2ch' | '3ch' | '4ch' | '5ch' | '10ch' | '20ch';
};

type VisibleField = {
  label: string;
  name: string;
  helperText?: string;
  error?: FieldError;
  errorDescribedBy?: string;
  requirement?: 'required' | 'optional';
  optionalLabel?: string;
  placeholder?: never;
  'aria-label'?: never;
  'aria-labelledby'?: never;
  role?: never;
  required?: never;
};
type TextareaNative = Omit<ComponentPropsWithoutRef<'textarea'>,
  keyof VisibleField | 'children' | 'value' | 'defaultValue' | 'onChange'>;
type TextareaChange = NonNullable<ComponentPropsWithoutRef<'textarea'>['onChange']>;
type TextareaValue = { value: string; defaultValue?: never; onChange: TextareaChange } |
  { value: string; defaultValue?: never; readOnly: true; onChange?: TextareaChange } |
  { value?: never; defaultValue?: string; onChange?: TextareaChange };
export type TextareaProps = TextareaNative & VisibleField & TextareaValue & { children?: never };

type SelectNative = Omit<ComponentPropsWithoutRef<'select'>,
  keyof VisibleField | 'value' | 'defaultValue' | 'onChange' | 'multiple' | 'size' | 'tabIndex'>;
type SelectChange = NonNullable<ComponentPropsWithoutRef<'select'>['onChange']>;
type SelectValue = { value: string; defaultValue?: never; onChange: SelectChange } |
  { value?: never; defaultValue?: string; onChange?: SelectChange };
export type SelectProps = SelectNative & VisibleField & SelectValue & {
  children: ReactNode;
  multiple?: never;
  size?: 1;
  readOnly?: never;
  tabIndex?: 0;
};

export type LegendStyle = 'page' | 'default' | 'section' | 'subsection' | 'compact';
export type FieldsetHeadingLevel = 'none' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type FieldsetError = { errorAssociation?: 'group'; error?: FieldError } |
  { errorAssociation: 'children'; error?: FieldError & { id: string } };
export type FieldsetProps = Omit<ComponentPropsWithoutRef<'fieldset'>,
  'children' | 'aria-invalid' | 'aria-label' | 'aria-labelledby' | 'role' | 'tabIndex'> & FieldsetError & {
  legend: string;
  legendStyle?: LegendStyle;
  headingLevel?: FieldsetHeadingLevel;
  helperText?: string;
  children: ReactNode;
  'aria-invalid'?: never;
  'aria-label'?: never;
  'aria-labelledby'?: never;
  role?: never;
  tabIndex?: never;
};

type ChoiceNative = Omit<ComponentPropsWithoutRef<'input'>,
  'children' | 'type' | 'value' | 'defaultValue' | 'checked' | 'defaultChecked' | 'onChange' |
  'readOnly' | 'role' | 'aria-checked' | 'aria-label' | 'aria-labelledby'>;
type ChoiceChange = NonNullable<ComponentPropsWithoutRef<'input'>['onChange']>;
type ChoiceChecked = { checked: boolean; defaultChecked?: never; onChange: ChoiceChange } |
  { checked?: never; defaultChecked?: boolean; onChange?: ChoiceChange };
export type CheckboxProps = ChoiceNative & ChoiceChecked & {
  label: string;
  name: string;
  value: string;
  description?: string;
  error?: FieldError;
  indeterminate?: boolean;
  children?: never;
  type?: never;
  readOnly?: never;
  role?: never;
  'aria-checked'?: never;
  'aria-label'?: never;
  'aria-labelledby'?: never;
};
export type RadioProps = Omit<CheckboxProps, 'error' | 'indeterminate' | 'aria-invalid'> & ChoiceChecked & {
  error?: never;
  indeterminate?: never;
  'aria-invalid'?: never;
};

export type DatePart = 'day' | 'month' | 'year';
export type DateInputValue = Record<DatePart, string>;
type DateValueOwnership = {
  value: DateInputValue; defaultValue?: never;
  onValueChange: (value: DateInputValue, detail: { part: DatePart }) => void;
} | {
  value: DateInputValue; defaultValue?: never; readOnly: true;
  onValueChange?: (value: DateInputValue, detail: { part: DatePart }) => void;
} | {
  value?: never; defaultValue?: DateInputValue;
  onValueChange?: (value: DateInputValue, detail: { part: DatePart }) => void;
};
type DateErrorOwnership = { errorAssociation?: 'group'; invalidParts?: never; error?: FieldError } |
  { errorAssociation: 'children'; invalidParts: readonly [DatePart, ...DatePart[]]; error: FieldError };
export type DateInputProps = Omit<ComponentPropsWithoutRef<'fieldset'>,
  'children' | 'value' | 'defaultValue' | 'onChange' | 'onInput' | 'onReset' | 'role' | 'tabIndex' | 'aria-invalid' | 'aria-label' | 'aria-labelledby'> &
  DateValueOwnership & DateErrorOwnership & {
    legend: string;
    name: string;
    helperText?: string;
    required?: boolean;
    optionalLabel?: string;
    readOnly?: boolean;
    purpose?: 'date' | 'date-of-birth';
    labels?: Partial<Record<DatePart, string>>;
    partNames?: Record<DatePart, string>;
    children?: never;
    onChange?: never;
    onInput?: never;
    onReset?: never;
    role?: never;
    tabIndex?: never;
    'aria-invalid'?: never;
    'aria-label'?: never;
    'aria-labelledby'?: never;
  };

export type ErrorSummaryItem = { id: string; text: string; targetId: string; contextId?: string };
export type ErrorSummaryProps = Omit<ComponentPropsWithoutRef<'div'>,
  'children' | 'title' | 'role' | 'tabIndex' | 'aria-live' | 'aria-label' | 'aria-labelledby'> & {
  title?: string;
  description?: string;
  errors: readonly ErrorSummaryItem[];
  /** Pass a new value for every failed submit. Omit for passive display. */
  focusRequestKey?: string | number;
  children?: never;
  role?: never;
  tabIndex?: never;
  'aria-live'?: never;
  'aria-label'?: never;
  'aria-labelledby'?: never;
};

export type DialogCloseReason = 'close-button' | 'escape' | 'backdrop' | 'action';
type DialogName = { title: string; showTitle?: true; accessibleLabel?: never } |
  { title?: never; showTitle?: false; accessibleLabel: string } |
  { title: string; showTitle: false; accessibleLabel: string };
type DialogDismissal = { dismissal?: 'dismissible'; showClose?: boolean; actions?: ReactNode } |
  { dismissal: 'forced-decision'; showClose?: false; actions: ReactNode };
type DialogNative = Omit<ComponentPropsWithoutRef<'dialog'>,
  'open' | 'children' | 'title' | 'autoFocus' | 'tabIndex' | 'role' | 'aria-modal' | 'aria-label' | 'aria-labelledby' |
  'onCancel' | 'onClose' | 'onKeyDown' | 'onPointerDown' | 'onPointerUp' | 'onPointerCancel' | 'onSubmit' | 'onSubmitCapture' | 'closedby'>;
/** Controlled native modal; children supply the canonical Content slot. */
export type DialogProps = DialogNative & DialogName & DialogDismissal & {
  open: boolean;
  onOpenChange: (open: boolean, detail: { reason: DialogCloseReason }) => void;
  closeLabel?: string;
  size?: 'small' | 'medium' | 'large';
  presentation?: 'inset' | 'fullscreen';
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  /** Logical fallback/explicit destination when the opening trigger is unavailable. */
  returnFocusRef?: { readonly current: HTMLElement | null };
};

export type TabsItem = { id: string; label: string; heading: string; content: ReactNode };
type TabsName = { label: string; labelledBy?: never } | { label?: never; labelledBy: string };
type TabsSelection = { selectedId: string; defaultSelectedId?: never; onSelectedChange: (id: string) => void } |
  { selectedId?: never; defaultSelectedId?: string; onSelectedChange?: (id: string) => void };
export type TabsProps = Omit<ComponentPropsWithoutRef<'div'>,
  'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'onChange' | 'tabIndex' | 'dangerouslySetInnerHTML'> & TabsName & TabsSelection & {
  items: readonly TabsItem[];
  activation?: 'automatic' | 'manual';
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

export type ToastState = 'success' | 'info' | 'warning' | 'error';
export type ToastMessage = {
  id: string; state?: ToastState; titleText: string; descriptionText?: string;
  announcement?: 'polite' | 'assertive'; dismissLabel: string;
};
export type ToastAPI = { add: (message: ToastMessage) => string; dismiss: (id: string) => void };
export type ToastProviderProps = {
  children: ReactNode;
  regionLabel?: string;
  emptyText?: string;
  stateLabels?: Record<ToastState, string>;
  formatCountLabel?: (count: number) => string;
  /** Formats one channel's new events only. Include count and essential outcomes for bursts. */
  formatAnnouncement?: (messages: readonly ToastMessage[]) => string;
  onDismiss?: (id: string) => void;
};
/** Both host parts must remain mounted once, outside route content and modals. */
export type ToastRegionProps = { className?: string };
export type ToastNotificationsButtonProps = { className?: string };

export type AlertState = 'success' | 'info' | 'warning' | 'error';
export type BadgeTone = 'neutral' | AlertState;
type FeedbackContainerProps = Pick<ComponentPropsWithoutRef<'div'>, 'id' | 'className' | 'style' | 'lang' | 'dir'>;
export type AlertProps = FeedbackContainerProps & {
  state?: AlertState;
  titleText: string;
  descriptionText?: string;
  headingLevel?: 'none' | 2 | 3 | 4 | 5 | 6;
  announcement?: 'none' | 'polite' | 'assertive';
  /** Complete localised equivalents, including punctuation, for the fixed states. */
  stateLabels?: Record<AlertState, string>;
};
export type BadgeProps = FeedbackContainerProps & { label: string; tone?: BadgeTone };

export type AccordionItem = { id: string; title: string; content: ReactNode };
type AccordionExpansion = { expandedIds: readonly string[]; defaultExpandedIds?: never; onExpandedChange: (ids: string[]) => void } | { expandedIds?: never; defaultExpandedIds?: readonly string[]; onExpandedChange?: (ids: string[]) => void };
export type AccordionProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role' | 'tabIndex' | 'onChange' | 'dangerouslySetInnerHTML'> & AccordionExpansion & { items: readonly AccordionItem[]; headingLevel: 2 | 3 | 4 | 5 | 6; titleStyle?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; panelLandmark?: boolean };
export type StepperChangeDetail = { source: 'input' | 'increment' | 'decrement' };
type StepperValue = { value: string; defaultValue?: never; onValueChange: (value: string, detail: StepperChangeDetail) => void } | { value?: never; defaultValue?: string; onValueChange?: (value: string, detail: StepperChangeDetail) => void };
export type StepperProps = Omit<ComponentPropsWithoutRef<'input'>, 'children' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'onInput' | 'readOnly' | 'min' | 'max' | 'step' | 'required' | 'placeholder' | 'role' | 'aria-label' | 'aria-labelledby' | 'aria-valuenow' | 'aria-valuemin' | 'aria-valuemax'> & StepperValue & {
  label: string; name: string; helperText?: string; error?: FieldError; errorDescribedBy?: string; requirement?: 'required' | 'optional'; optionalLabel?: string; min?: number; max?: number; step: number; incrementLabel: string; decrementLabel: string; formatValueAnnouncement?: (value: string, label: string) => string;
};
