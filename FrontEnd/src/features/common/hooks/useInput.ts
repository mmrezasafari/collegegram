import React, { useRef, useState, type ChangeEvent } from 'react'

type ValidateFn<T> = (value: T) => string | null

let inputIdCounter = 0

export function useInput<T extends string = string>(
  name: string,
  initialValue: T = '' as T,
  validateFn?: ValidateFn<T>,
) {
  const [value, setValue] = useState<T>(initialValue)
  const [edited, setEdited] = useState(false)
  const [error, setError] = useState<string>('')
  const idRef = useRef(`input-${++inputIdCounter}`)
  const inputRef = useRef<HTMLInputElement>(null)

  const validate = (val: T) => {
    if (!validateFn) return
    const validationError = validateFn(val)
    setError(validationError || '')
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value as T
    setValue(newValue)

    if (edited && validateFn) {
      validate(newValue)
    }
  }

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!edited) setEdited(true)

    validate(e.target.value as T)
  }

  const reset = () => {
    setValue(initialValue)
    setEdited(false)
    setError('')
  }

  return {
    name,
    id: idRef,
    ref: inputRef,
    value,
    edited,
    error,
    setError,
    onChange,
    onBlur,
    reset,
    setValue,
  }
}

