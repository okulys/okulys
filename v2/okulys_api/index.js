// const fastify = require('fastify')()
// const userService = require("./app/services/UserService")

// var config = require("./app/config/api.json")

// fastify.register(require('fastify-jwt'), { secret: 'supersecret' })
//        .register(require('./fastify-auth'))


// fastify.decorate('verifyJWT', userService.verifyJWT)
// fastify.decorate('verifyUserAndPassword', verify)


// function verifyUserAndPassword(request, reply, done) {
//     const level = this.level

//     level.get(request.body.user, onUser)

//     function onUser(err, password) {
//         if (err) {
//             if (err.notFound) {
//                 return done(new Error('Password not valid'))
//             }
//             return done(err)
//         }

//         if (!password || password !== request.body.password) {
//             return done(new Error('Password not valid'))
//         }

//         done()
//     }
// }


// fastify.register(require('./app/routes/v1/ColorRoute'), { prefix: '/v1' })
// fastify.register(require('./app/routes/v1/PointRoute'), { prefix: '/v1' })

// fastify.listen(config.server.port)


// const user = { name: "Sergio", lastname: "Clemente Baltasar", username: "cle", password: "salida12", authority: "USER" };
// const loginGood = { username: "cle", password: "salida12" }
// const loginBad1 = { username: "cle", password: "salida" }
// const loginBad2 = { username: "cleb", password: "salida12" }

// const UserService = require("./app/services/UserService")

// // UserService.create(user);

// UserService.verify(loginBad1.username, loginBad1.password).then(e => console.log("loginBad1: " + e))
// UserService.verify(loginBad2.username, loginBad2.password).then(e => console.log("loginBad2: " + e))
// UserService.verify(loginGood.username, loginGood.password).then(e => console.log("loginGood: " + e))
