const DB = require("./Database")
const bcrypt = require('bcrypt');

// Models
const User = require("../models/User")
const Auth = require("../models/Auth")

class UserService {

    constructor() {
        this.instance = null;
    }

    static getInstance() {
        if (this.instance == null)
            this.instance = new UserService();
        return this.instance;
    }

    create(user) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, function (err, passwordEncrypted) {
                DB.sequelize.sync()
                    .then(() => DB.User.create({
                        name: user.name,
                        lastname: user.lastname,
                        auth: {
                            username: user.username,
                            password: passwordEncrypted,
                            authority: user.authority
                        }
                    }, {
                            include: [{
                                association: DB.User.Auth,
                            }]
                        })
                    )
            });
        });
    }

    getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            DB.User.find({
                attributes: ['id', 'name', 'lastname'],
                include: [{
                    model: DB.Auth, attributes: ['username', 'authority'], where: {
                        username: "clebal"
                    }
                }]
            }).then(e => {
                resolve(User.fromJson(e.dataValues, e.auth.dataValues))
            }).catch(err => {
                reject(err);
            })
        })
    }

    verify(username, password, fastify) {
        return new Promise((resolve, reject) => {
            DB.Auth.find({
                attributes: ['username', 'password'], where: {
                    username: username
                }
            }).then(e => {
                if (e == null) {
                    resolve(false)
                } else {
                    bcrypt.compare(password, e.dataValues.password, function (err, res) {
                        if (res == true) { 
                            resolve(fastify.jwt.sign({ username, password })); 
                        } else resolve(false)
                    });
                }
            });
        })
    }

    // verifyJWT(jwt, fastify) {
    //     const jwt = this.jwt

    //     if (!request.req.headers['auth']) {
    //         return done(new Error('Missing token header'))
    //     }

    //     jwt.verify(request.req.headers['auth'], onVerify)

    //     function onVerify(err, decoded) {
    //         if (err || !decoded.user || !decoded.password) {
    //             return done(new Error('Token not valid'))
    //         }

    //         // level.get(decoded.user, onUser)

    //         function onUser(err, password) {
    //             if (err) {
    //                 if (err.notFound) {
    //                     return done(new Error('Token not valid'))
    //                 }
    //                 return done(err)
    //             }

    //             if (!password || password !== decoded.password) {
    //                 return done(new Error('Token not valid'))
    //             }

    //             done()
    //         }
    //     }
    // }

}


module.exports = UserService.getInstance();