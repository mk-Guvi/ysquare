require('dotenv').config()
require('../config/db.js')
const jwt = require('jsonwebtoken')
const jwtkey = process.env.JWT_TOKEN1
const express = require('express')
const User = require('../models/User')
const userToken = require('../services/userToken')
const UserRouter = express.Router()
const { generateHash, compareHash } = require('../services/Hash.js')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).json({ status: 'Invalid user' })
  jwt.verify(token, jwtkey, (err) => {
    if (err) return res.status(403).json({ status: 'Invalid users' })
  })
  next()
}
/**
 * @swagger
 * components:
 *  schemas:
 *     User:
 *       type: object
 *       required:
 *         - Name
 *         - email
 *          -password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         Name:
 *           type: string
 *           description: The book title
 *         email:
 *           type: string
 *         password: 
 *           format:password
 */

UserRouter.get('/users', async (req, res) => {
  try {
    const user = await User.find({})
    res.status(200).json({ user })
  } catch (e) {
    console.error(e)
    res.status(500).send('internal server error')
  }
})
  .post('/Newuser', async (req, res) => {
    const { Name, email, password } = req.body
    const userDetails = {
      Name,
      email,
      password,
    }
    try {
      //since we use await we need to use try-catch block
      const checkUser = await User.findOne({ email: email })
      if (checkUser) {
        res.status(400).json({ result: 'Email already Exist' })
      } else {
        const result = await new User({
          Name: userDetails.Name,
          email: userDetails.email,
          passwordHash: await generateHash(userDetails.password),
        }).save()
        res.status(200).json({ result })
      }
    } catch (e) {
      console.error(e)
    }
  })
  .post('/login', async (req, res) => {
    try {
      const { email, password } = req.body
      const userDetails = await User.findOne({ email }).exec()
      if (userDetails) {
        const result = await compareHash(password, userDetails.passwordHash)
        if (result) {
          const Token = userToken(email)
          res.status(200).json({ status: 'success', token: Token })
        } else {
          res
            .status(400)

            .json({ status: 'Invalid user/password' })
        }
      } else {
        res
          .status(400)

          .json({ status: 'Invalid user/password' })
      }
    } catch (e) {
      console.error(e)
      res
        .status(500)

        .json({ status: 'Internal server serror' })
    }
  })

module.exports = UserRouter
