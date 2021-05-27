require('../src/config/db.js')
const express = require('express')
const cors = require('cors')
const UserRouter = require('./routers/userRouter')
const bodyparser = require('body-parser')
const swaggerJSDOC = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: 'RESTAPI',
      version: '1.0.0',
      description: 'ysquare users rest api',
      
    },
    servers: [{ url: 'http://locahost:8080' }],
  },
  apis: ["./routers/*.js"],
}
const specs = swaggerJSDOC(options)
const app = express()

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.get('/', (req,res) => {
  res.send('<h1>Rest API Server!</h1>')
})
app.use(cors())
app.use(bodyparser.json())
app.use('/user', UserRouter)

app.listen(process.env.PORT || 8080, () => {
  console.log('Server running @ 8080')
})
