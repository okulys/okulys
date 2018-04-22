const Sequelize = require('sequelize');
const Auth = require("./Auth")

class User extends Auth {
    constructor(id, name, lastname, username, password, authority) {
        super(username, password, authority)
        this.id = id || null;
        this.name = name || null;
        this.lastname = lastname || null;
        // this.color_blindness = color_blindness || null;
    }

    static schema() {
        return {
            id:        { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            name:      { type: Sequelize.STRING, allowNull: false },
            lastname:  { type: Sequelize.STRING, allowNull: false }
        }
    }

    static fromJson(user, auth) {
        return new User(user.id, user.name, user.lastname, auth.username, auth.password, auth.authority)
    }
}

module.exports = User;