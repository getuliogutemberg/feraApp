"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class Alert extends sequelize_1.Model {
}
Alert.init({
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: null
    }
}, {
    sequelize: database_1.default,
    modelName: 'Alert',
    schema: 'internal',
    timestamps: true,
    paranoid: true,
});
exports.default = Alert;
//# sourceMappingURL=Alert.js.map