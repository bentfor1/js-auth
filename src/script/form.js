export const REG_EXP_EMAIL = new RegExp(
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/,
)
export const REG_EXP_PASSWORD = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
)

export class Form {
  FIELD_NAME = {}
  FIELD_ERRPR = {}

  value = {}
  error = {}
  disabled = true

  change = (name, value) => {
    console.log(name, value)

    const error = this.validate(name, value)
    this.value[name] = value

    if (error) {
      this.setError(name, error)
      this.error[name] = error
    } else {
      this.setError(name, null)
      delete this.error[name]
    }
    this.checkDisabled()
  }

  setError = (name, error) => {
    const span = document.querySelector(
      `.form__error[name='${name}']`,
    )
    const field = document.querySelector(
      `.validation[name='${name}']`,
    )

    if (span) {
      span.classList.toggle(
        'form__error--active',
        Boolean(error),
      )
      span.innerHTML = error || ''
    }

    if (field) {
      field.classList.toggle(
        'validation--active',
        Boolean(error),
      )
    }
  }

  checkDisabled = () => {
    let disabled = false

    Object.values(this.FIELD_NAME).forEach((name) => {
      if (
        this.error[name] ||
        this.value[name] === undefined
      ) {
        disabled = true
      }
    })

    const el = document.querySelector('.button')

    if (el) {
      el.classList.toggle(
        'button--disabled',
        Boolean(disabled),
      )
    }

    this.disabled = disabled
  }

  validateAll = () => {
    Object.values(this.FIELD_NAME).forEach((name) => {
      const error = this.validate(name, this.value[name])

      if (error) {
        this.setError(name, error)
      }
    })
  }
}
//
