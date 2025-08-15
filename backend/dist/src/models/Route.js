"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class Route extends sequelize_1.Model {
}
Route.init({
    path: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    component: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    requiredRole: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        defaultValue: []
    },
    pageId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    reportId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    workspaceId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    icon: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: database_1.default,
    modelName: 'Route',
    schema: 'internal',
    timestamps: true
});
exports.default = Route;
//# sourceMappingURL=Route.js.map