import { useEffect, useRef } from 'react'

import './OTPInput.css'
import './Input.css'

export default function OTPInput({
  amount,
  setVerify,
  pastedWrongOTP,
  error,
  setError,
  autoFocus,
}) {
  const inputs = Array(amount).fill(0)
  const inputRefs = useRef([])

  useEffect(() => {
    if (error) {
      inputRefs.current.map((inputRef) => (inputRef.value = ''))
      inputRefs.current[0].focus()
    }
  }, [error])

  function handleKeyDown(e, i) {
    if (e.key === 'Backspace' && i > 0) {
      setTimeout(() => inputRefs.current[i - 1].focus())
      changeVerify()
    }
  }

  function handleChange(e, i) {
    const value = e.target.value
    if (value.length === 1 && i < amount - 1) inputRefs.current[i + 1].focus()
    changeVerify()
  }

  function paste(e) {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')

    if (/^\d{6}$/.test(pastedText)) {
      for (let i = 0; i < inputRefs.current.length; i++) {
        const inputRef = inputRefs.current[i]
        inputRef.value = pastedText[i]
      }
      inputRefs.current.at(-1).focus()
      changeVerify()
      return
    }

    if (pastedWrongOTP) pastedWrongOTP()
  }

  function changeVerify() {
    const verify = inputRefs.current.map((inputRef) => inputRef.value).join('')
    setVerify(verify)
    setError(false)
  }

  return (
    <>
      <div className="OTP_input">
        {inputs.map((_, i) => (
          <input
            type="tel"
            key={i}
            maxLength={1}
            className={`${error ? 'error' : ''}`}
            ref={(el) => (inputRefs.current[i] = el)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onChange={(e) => handleChange(e, i)}
            onPaste={paste}
            autoFocus={autoFocus && i === 0}
          />
        ))}
      </div>
    </>
  )
}
