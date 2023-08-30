// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')

User.create({
  email: 'test@mail.com',
  password: 123,
  role: 1,
})
// ================================================================

router.get('/signup', function (req, res) {
  res.render('signup', {
    name: 'signup',

    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    title: 'Signup Page ',

    data: {
      role: [
        { value: User.USER_ROLE.USER, text: 'Користувач' },
        {
          value: User.USER_ROLE.ADMIN,
          text: 'Адміністратор',
        },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Розробник',
        },
      ],
    },
  })
})

router.post('/signup', function (req, res) {
  const { email, password, role } = req.body

  if (!email || !password || !role) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const existingUser = User.getByEmail(email)

    if (existingUser) {
      return res.status(401).json({
        message: 'Користувач з таким e-mail вже уснує',
      })
    } else {
      User.create({ email, password, role })

      return res.status(200).json({
        message: 'Користувач успішно зареєстрований',
      })
    }
  } catch (error) {
    return res.status(400).json({
      message: 'Помилка створення користувача',
    })
  }
})

// ================================================================

router.get('/recovery', function (req, res) {
  res.render('recovery', {
    name: 'recovery',

    component: ['back-button', 'field'],

    title: 'Recovery Page ',

    data: {},
  })
})

// ================================================================

router.post('/recovery', function (req, res) {
  const { email } = req.body
  console.log(email)

  if (!email) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }
  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(401).json({
        message:
          'Такого користувача з таким e-mail не існує ',
      })
    }

    Confirm.create(email)
    return res.status(200).json({
      message:
        'Код для відновлення паролю відправлено на ваш e-mail',
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

// ================================================================

router.get('/recovery-confirm', function (req, res) {
  res.render('recovery-confirm', {
    name: 'recovery-confirm',

    component: ['back-button', 'field', 'field-password'],

    title: 'Recovery Confirm Page ',

    data: {},
  })
})
// ================================================================

router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  console.log(password, code)

  if (!code || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(401).json({
        message: 'Такого коду не існує',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(401).json({
        message: 'Користувач з таким e-mail не існує',
      })
    }

    user.password = password

    console.log(user)

    return res.status(200).json({
      message: 'Пароль змінено',
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

module.exports = router
