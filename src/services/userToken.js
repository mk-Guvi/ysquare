require('dotenv').config()
const jwt = require('jsonwebtoken')
const jwtkey = process.env.JWT_TOKEN1

const userToken = (email) => {
  const token = jwt.sign(
    {
      email,
    },
    jwtkey,
    { expiresIn: "15s" }
  )
  return token
}
module.exports = userToken
