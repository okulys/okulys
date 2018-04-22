const config = require("../config/api.json")
const Sequelize = require('sequelize');

// Models
const UserModel = require("../models/User")
const AuthModel = require("../models/Auth")

class DB {
    constructor() {
        this.instance = null;
        this.sequelize = this.initialize();

        // Models-Tables
        this.Auth = this.sequelize.define('auth', AuthModel.schema());
        this.User = this.sequelize.define('user', UserModel.schema());

        // Relationships
        this.User.Auth = this.User.belongsTo(this.Auth);
    }

    initialize() {
        return new Sequelize(config.development.database.database, config.development.database.username, config.development.database.password, {
            host: config.development.database.host,
            dialect: config.development.database.dialect,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            operatorsAliases: false
        });
    }

    static getInstance() {
        if (this.instance == null) {
            this.instance = new DB();
        }
        return this.instance;
    }
}

module.exports = DB.getInstance();