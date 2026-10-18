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
