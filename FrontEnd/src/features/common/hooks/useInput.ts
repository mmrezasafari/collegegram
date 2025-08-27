import React, { useRef, useState, type ChangeEvent } from 'react'

type ValidateFn<T> = (value: T) => string | null

let inputIdCounter = 0

export function useInput<
  T extends string | boolean = string,
  E extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement
>(
  name: string,
  initialValue: T,
  validateFn?: ValidateFn<T>,
) {
  const [value, setValue] = useState<T>(initialValue as T)
  const [edited, setEdited] = useState(false)
  const [error, setError] = useState<string>('')
  const idRef = useRef(`input-${++inputIdCounter}`)
  const inputRef = useRef<E>(null)

  const validate = (val: T) => {
    if (!validateFn) return
    const validationError = validateFn(val)
    setError(validationError || '')
  }

  const onChange: React.ChangeEventHandler<E> = (e: ChangeEvent<E>) => {
    let newValue: any

    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      newValue = e.target.checked as T // checkbox → boolean
    } else {
      newValue = e.target.value as T   // text/textarea → string
    }

    setValue(newValue)

    if (edited && validateFn) {
      validate(newValue)
    }
  }

  const onBlur: React.ChangeEventHandler<E> = (e: React.FocusEvent<E>) => {
    if (!edited) setEdited(true)
    let val: any =
      e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value
    validate(val as T)
  }

  const reset = () => {
    setValue(initialValue as T)
    setEdited(false)
    setError('')
  }

  return {
    name,
    id: idRef.current,
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

