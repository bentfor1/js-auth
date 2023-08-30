import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
} from '../../script/form'

class RecoveryConfirmForm extends Form {
  FIELD_NAME = {
    CODE: 'code',
    PASSWORD: 'password',
    PPASSWORD_AGAIN: 'passwordAgain',
  }
  FIELD_ERRPR = {
    IS_EMPTY: 'Введіть значення в поле',
    IS_BIG: 'Дуже довге значення, прибьеріть зайве',
    PASSWORD:
      'Пароль повинен складатися не менше ніж 8 символів, включаючи хочаб одну цифру та велику літеру',
    PPASSWORD_AGAIN:
      'Ваш другий пароль не збігається з першим',
  }

  validate = (name, value) => {
    if (String(value).length < 1) {
      return this.FIELD_ERRPR.IS_EMPTY
    }
    if (String(value).length > 30) {
      return this.FIELD_ERRPR.IS_BIG
    }

    if (name === this.FIELD_NAME.PASSWORD) {
      if (!REG_EXP_PASSWORD.test(String(value))) {
        return this.FIELD_ERRPR.PASSWORD
      }
    }
    if (name === this.FIELD_NAME.PPASSWORD_AGAIN) {
      if (
        String(value) !==
        this.value[this.FIELD_NAME.PASSWORD]
      ) {
        return this.FIELD_ERRPR.PPASSWORD_AGAIN
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
        const res = await fetch('/recovery-confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: this.convertData(),
        })

        const data = await res.json()

        if (res.ok) {
          this.setAlert('success', data.message)
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
      [this.FIELD_NAME.CODE]: Number(
        this.value[this.FIELD_NAME.CODE],
      ),
      [this.FIELD_NAME.PASSWORD]:
        this.value[this.FIELD_NAME.PASSWORD],
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

window.recoveryConfirmForm = new RecoveryConfirmForm()
