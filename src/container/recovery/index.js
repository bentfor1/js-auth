import { Form, REG_EXP_EMAIL } from '../../script/form'

class RecoveryForm extends Form {
  FIELD_NAME = {
    EMAIL: 'email',
  }
  FIELD_ERRPR = {
    IS_EMPTY: 'Введіть значення в поле',
    IS_BIG: 'Дуже довге значення, прибьеріть зайве',
    EMAIL: 'Введіть коректне значення e-mail адреси',
  }

  validate = (name, value) => {
    if (String(value).length < 1) {
      return this.FIELD_ERRPR.IS_EMPTY
    }
    if (String(value).length > 30) {
      return this.FIELD_ERRPR.IS_BIG
    }
    if (name === this.FIELD_NAME.EMAIL) {
      if (!REG_EXP_EMAIL.test(String(value))) {
        return this.FIELD_ERRPR.EMAIL
      }
    }

    return null
  }

  submit = async () => {
    if (this.disabled === true) {
      this.validateAll()
    } else {
      console.log(this.value)

      this.setAlert('progress', 'Завантаження...')

      try {
        const res = await fetch('/recovery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: this.convertData(),
        })

        const data = await res.json()

        if (res.ok) {
          this.setAlert('success', data.message)
          location.assign('/recovery-confirm')
        } else {
          this.setAlert('error', data.message)
        }
      } catch (error) {
        this.setAlert('error', error.message)
      }
    }
  }

  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.EMAIL]:
        this.value[this.FIELD_NAME.EMAIL],
    })
  }

  setAlert = (status, text) => {
    const el = document.querySelector('.alert')

    if (status === 'progress') {
      el.className = 'alert alert--progress'
    } else if (status === 'success') {
      el.className = 'alert alert--success'
    } else if (status === 'error') {
      el.className = 'alert alert--error'
    } else {
      el.className = 'alert alert--disabled'
    }

    if (text) el.innerText = text
  }
}

window.recoveryForm = new RecoveryForm()
