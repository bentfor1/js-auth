// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

User.create({
  email: 'user@mail.com',
  password: 123,
  role: 1,
})

User.create({
  email: 'admin@mail.com',
  password: 123,
  role: 2,
})
User.create({
  email: 'dev@mail.com',
  password: 123,
  role: 3,
})
User.create({
  email: 'user1@mail.com',
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
    const user = User.getByEmail(email)

    if (user) {
      return res.status(401).json({
        message: 'Користувач з таким e-mail вже уснує',
      })
    }

    const newUser = User.create({ email, password, role })

    const session = Session.create(newUser)

    Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'Користувач успішно зареєстрований',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      // message: error.message,
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
      return res.status(400).json({
        message: 'Користувач з таким e-mail не існує',
      })
    }

    user.password = password

    console.log(user)
    const session = Session.create(user)

    return res.status(200).json({
      message: 'Пароль змінено',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

// ================================================================

router.get('/signup-confirm', function (req, res) {
  const { renew, email } = req.query
  if (renew) {
    Confirm.create(email)
  }
  res.render('signup-confirm', {
    name: 'signup-confirm',

    component: ['back-button', 'field'],

    title: 'Signup Confirm Page ',

    data: {},
  })
})

// ================================================================

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(401).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Помилка. Ви не увійшли в аккаунт',
      })
    }
    const email = Confirm.getData(code)

    if (!email) {
      return res.status(400).json({
        message: 'Код не існує',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Код не дійсний',
      })
    }

    session.user.isConfirm = true

    User.confirmByEmail(email, true)

    return res.status(200).json({
      message: 'Ви підтвердили свою пошту',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

// ================================================================

router.get('/login', function (req, res) {
  res.render('login', {
    name: 'login',

    component: ['back-button', 'field', 'field-password'],

    title: 'Login Page ',

    data: {},
  })
})

// ================================================================

router.post('/login', function (req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувач з таким e-mail не існує',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Помилка. Пароль не підходить',
      })
    }

    const session = Session.create(user)
    return res.status(200).json({
      message: 'Ви увійшли',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

// ================================================================

module.exports = router
