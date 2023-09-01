class Session {
  static #list = []

  constructor(user) {
    this.token = Session.generateCode()
    this.user = {
      email: user.email,
      isConfirm: user.isConfirm,
      role: user.role,
      id: user.id,
    }
  }

  static generateCode = () => {
    const length = 6
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    let result = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(
        Math.random() * characters.length,
      )
      result += characters[randomIndex]
    }

    return result
  }

  static create = (data) => {
    const session = new Session(data)

    this.#list.push(session)

    return session
  }

  static get = (token) => {
    const data = this.#list.find(
      (item) => item.token === token,
    )
    console.log('Session list:', this.#list)

    return data || null
  }
}

module.exports = {
  Session,
}
