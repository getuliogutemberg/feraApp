"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminDatabaseController_1 = __importDefault(require("../controllers/adminDatabaseController"));
const router = (0, express_1.Router)();
router.post('/test', adminDatabaseController_1.default.testConnection);
router.post('/tables', adminDatabaseController_1.default.listTables);
exports.default = router;
//# sourceMappingURL=adminDatabase.js.map