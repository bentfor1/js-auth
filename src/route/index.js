// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.render('index', {
    name: 'index',

    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    title: 'Index Page',

    data: {},
  })
})

router.get('/home', function (req, res) {
  res.render('home', {
    name: 'home',

    component: ['back-button', 'field'],

    title: 'Home Page',

    data: {},
  })
})

router.get('/logout', function (req, res) {
  res.render('logout', {
    name: 'logout',

    component: ['back-button', 'field'],

    title: 'Logout Page',

    data: {},
  })
})

const auth = require('./auth')
const user = require('./user')
// Підключіть інші файли роутів, якщо є
// Об'єднайте файли роутів за потреби

router.use('/', auth)
router.use('/', user)
// Використовуйте інші файли роутів, якщо є

// Експортуємо глобальний роутер
module.exports = router
