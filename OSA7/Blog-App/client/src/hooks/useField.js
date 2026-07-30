import { useState } from 'react'

const useField = (type = 'text', extra = {}) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  // The `asProps` object can be spread onto an <input> directly. We don't
  // return `reset` inside it so spreading doesn't accidentally add a stray
  // attribute to the DOM node.
  return {
    type,
    value,
    onChange,
    reset,
    asProps: { type, value, onChange, ...extra },
  }
}

export default useField
