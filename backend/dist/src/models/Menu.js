"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class Menu extends sequelize_1.Model {
}
Menu.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    component: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    requiredRole: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        defaultValue: []
    },
    subRoutes: {
        type: sequelize_1.DataTypes.JSONB,
        defaultValue: []
    },
    isDirectModule: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
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
    }
}, {
    sequelize: database_1.default,
    modelName: 'Menu',
    schema: 'internal',
    timestamps: true
});
exports.default = Menu;
//# sourceMappingURL=Menu.js.map