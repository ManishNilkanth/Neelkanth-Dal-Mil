import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-primary">
        {label}
        {props.required && <span className="text-red-600"> *</span>}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-primary transition-colors placeholder:text-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:bg-muted dark:focus:ring-brand-800 ${error ? 'border-red-500' : 'border-default'} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, id, className = '', ...props }: TextareaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-primary">
        {label}
        {props.required && <span className="text-red-600"> *</span>}
      </label>
      <textarea
        id={inputId}
        className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-primary transition-colors placeholder:text-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:bg-muted dark:focus:ring-brand-800 ${error ? 'border-red-500' : 'border-default'} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  children: ReactNode
}

export function Select({ label, error, id, children, className = '', ...props }: SelectProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-primary">
        {label}
        {props.required && <span className="text-red-600"> *</span>}
      </label>
      <select
        id={inputId}
        className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-primary focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:bg-muted dark:focus:ring-brand-800 ${error ? 'border-red-500' : 'border-default'} ${className}`}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label htmlFor={inputId} className={`flex cursor-pointer items-center gap-3 ${className}`}>
      <input
        id={inputId}
        type="checkbox"
        className="h-5 w-5 rounded border-default text-brand-700 focus:ring-brand-500 dark:text-brand-400"
        {...props}
      />
      <span className="text-sm text-secondary">{label}</span>
    </label>
  )
}
