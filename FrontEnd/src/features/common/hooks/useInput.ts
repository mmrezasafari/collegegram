import React, {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from 'react'

let inputIdCounter = 0

export function useInput<
  T extends string | boolean,
  E extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>(name: string, initialValue: T, validateFn?: (value: T) => string | null) {
  const [value, setValue] = useState<T>(initialValue)
  const [edited, setEdited] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const idRef = useRef(`input-${++inputIdCounter}`)
  const inputRef = useRef<E>(null)

  const validate = (v: T) => {
    if (!validateFn) return
    const validationError = validateFn(v)
    setError(validationError || '')
  }

  const onChange: React.ChangeEventHandler<E> = (e: ChangeEvent<E>) => {
    let newValue: any

    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      newValue = e.target.checked as T
    } else {
      newValue = (e.target as HTMLInputElement | HTMLTextAreaElement).value as T
    }

    setValue(newValue)

    if (edited && validateFn) {
      validate(newValue)
    }
  }

  const onBlur: React.FocusEventHandler<E> = (e: FocusEvent<E>) => {
    if (!edited) setEdited(true)

    let val: any =
      e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value

    validate(val as T)
  }

  const reset = () => {
    setValue(initialValue)
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
