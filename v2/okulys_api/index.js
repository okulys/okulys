const fastify = require('fastify')()
var config = require("./app/config/api.json")

fastify.register(require('fastify-jwt'), { secret: 'supersecret' })

// fastify.register(require('./app/routes/v1/ColorRoute'), { prefix: '/v1' })
// fastify.register(require('./app/routes/v1/PointRoute'), { prefix: '/v1' })
// fastify.register(require('./app/routes/v1/UserRoute'), { prefix: '/v1' })

const user = { name: "Sergio", lastname: "Clemente Baltasar", username: "cle", password: "salida12", authority: "USER" };
const loginGood = { username: "cle", password: "salida12" }
const loginBad1 = { username: "cle", password: "salida" }
const loginBad2 = { username: "cleb", password: "salida12" }

const UserService = require("./app/services/UserService")

// UserService.create(user);

UserService.verify(loginBad1.username, loginBad1.password, fastify).then(e => console.log("loginBad1: " + e))
UserService.verify(loginBad2.username, loginBad2.password, fastify).then(e => console.log("loginBad2: " + e))
UserService.verify(loginGood.username, loginGood.password, fastify).then(e => console.log("loginGood: " + e))


fastify.listen(config.development.server.port)
