require('../config/db')
const Admin = require('../models/User.js')
const generateHash = require('../services/hash')

const seedUser = async () => {
  //since generatehash is async  process we make the function as async
  const user = {
    name: 'mk',
    email: 'admin@gmail.com',
    password: 'password',
  }
  try {
    //since we use await we need to use try-catch block
    new Admin({
      Name: user.name,
      email: user.email,
      passwordHash: await generateHash(user.password),
    })
      .save()
      .then(console.log)
      .catch(console.error)
  } catch (e) {
    console.error(e)
  }
}
seedUser()

// const clearAdmin = () => {
//   Admin.remove({}).then(console.log).catch(console.error)
// }
