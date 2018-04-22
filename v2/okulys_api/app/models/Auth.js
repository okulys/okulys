const Sequelize = require('sequelize');

class Auth {
    // TODO: Validate properties
    constructor(username, password, authority) {
        this.username = username || null;
        this.password = password || null;
        this.authority = authority || null; 
        // Se van a contemplar dos actores en principio: USER y MANAGER 
        // pero sus datos son iguales, osea ser, usamos el mismo modelo
    }

    static schema() {
        return {
            id:        { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            username:  { type: Sequelize.STRING, allowNull: false, unique: true },
            password:  { type: Sequelize.STRING, allowNull: false },
            authority: { type: Sequelize.STRING, allowNull: false, values: ['USER', 'MANAGER'] }
        };
    }
}

module.exports = Auth;