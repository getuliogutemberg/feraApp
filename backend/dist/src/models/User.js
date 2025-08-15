"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class User extends sequelize_1.Model {
}
User.init({
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    RG: {
        type: sequelize_1.DataTypes.STRING
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: sequelize_1.DataTypes.STRING
    },
    className: {
        type: sequelize_1.DataTypes.STRING
    },
    refreshToken: {
        type: sequelize_1.DataTypes.STRING
    }, jwtSecret: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    resetPasswordToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    resetPasswordExpires: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    position: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.FLOAT),
        defaultValue: [0, 0]
    },
    customIcon: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png'
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: ''
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'User',
    schema: 'internal',
    timestamps: true
});
exports.default = User;
//# sourceMappingURL=User.js.map